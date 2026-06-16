import { WatchHistory } from "../models/watchHistory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /watch-history/:videoId  — called when user watches a video
export const addToHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  await WatchHistory.findOneAndUpdate(
    { user: req.user._id, video: videoId },
    { user: req.user._id, video: videoId },
    { upsert: true, new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Added to watch history"));
});

// GET /watch-history  — paginated, newest first
export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const history = await WatchHistory.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "video",
      select: "title thumbnail duration views createdAt owner isPublished",
      populate: { path: "owner", select: "username fullName avatar" },
    });

  // Filter out docs where the video was deleted
  const filtered = history.filter((h) => h.video && h.video.isPublished);

  const total = await WatchHistory.countDocuments({ user: req.user._id });

  return res.status(200).json(
    new ApiResponse(200, {
      history: filtered,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  );
});

// DELETE /watch-history/:videoId  — remove one entry
export const removeFromHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const result = await WatchHistory.findOneAndDelete({
    user: req.user._id,
    video: videoId,
  });

  if (!result) throw new ApiError(404, "Entry not found in watch history");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Removed from watch history"));
});

// DELETE /watch-history  — clear entire history
export const clearHistory = asyncHandler(async (req, res) => {
  await WatchHistory.deleteMany({ user: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Watch history cleared"));
});