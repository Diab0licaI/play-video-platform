import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const searchVideos = asyncHandler(async (req, res) => {
  const { query } = req.params;

  const videos = await Video.find({
    title: {
      $regex: query,
      $options: "i",
    },
  }).populate(
    "owner",
    "fullName username avatar"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      videos,
      "Videos fetched successfully"
    )
  );
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { isPublished: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const videos = await Video.find(query)
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully")
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFileLocalPath) throw new ApiError(400, "Video file is required");
  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required");

  const uploadedVideo = await uploadOnCloudinary(videoFileLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideo) throw new ApiError(500, "Video upload failed");
  if (!uploadedThumbnail) throw new ApiError(500, "Thumbnail upload failed");

  const video = await Video.create({
    title,
    description,
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    duration: uploadedVideo.duration || 0,
    owner: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, video, "Video published successfully")
  );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId)
    .populate("owner", "fullName username avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  return res.status(200).json(
    new ApiResponse(200, video, "Video fetched successfully")
  );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own videos");
  }

  // Update thumbnail if provided
  let thumbnailUrl = video.thumbnail;
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    if (uploaded) thumbnailUrl = uploaded.url;
  }

  video.title = title || video.title;
  video.description = description || video.description;
  video.thumbnail = thumbnailUrl;

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own videos");
  }

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Video deleted successfully")
  );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only toggle your own videos");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { isPublished: video.isPublished },
      `Video ${video.isPublished ? "published" : "unpublished"} successfully`
    )
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  searchVideos,
};