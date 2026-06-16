import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate entries — one doc per user+video combo
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);