import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";
import { Video } from "../models/video.model.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(
      new ApiResponse(200, { liked: false }, "Like removed")
    );
  } else {
    await Like.create({ video: videoId, likedBy: userId });
    // Create a notification for the video owner
    const video = await Video.findById(videoId).select("owner");
    if (video && video.owner.toString() !== userId.toString()) {
      await Notification.create({
        recipient: video.owner,
        sender: userId,
        type: "VIDEO_LIKE",
        referenceId: videoId,
      });
    }
    return res.status(200).json(
      new ApiResponse(200, { liked: true }, "Like added")
    );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(
      new ApiResponse(200, { liked: false }, "Like removed")
    );
  } else {
    await Like.create({ comment: commentId, likedBy: userId });
    return res.status(200).json(
      new ApiResponse(200, { liked: true }, "Like added")
    );
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(
      new ApiResponse(200, { liked: false }, "Like removed")
    );
  } else {
    await Like.create({ tweet: tweetId, likedBy: userId });
    return res.status(200).json(
      new ApiResponse(200, { liked: true }, "Like added")
    );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $exists: true },
  }).populate("video", "title thumbnail videoFile duration views owner");

  return res.status(200).json(
    new ApiResponse(200, likedVideos, "Liked videos fetched")
  );
});

const getLikeStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const count = await Like.countDocuments({ video: videoId });
  const liked = !!(await Like.findOne({
    video: videoId,
    likedBy: userId,
  }));

  return res.status(200).json(
    new ApiResponse(200, { count, liked }, "Like status fetched")
  );
});

// add to exports
export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getLikeStatus,
};