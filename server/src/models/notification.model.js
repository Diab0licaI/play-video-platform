import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["SUBSCRIBE", "VIDEO_LIKE", "VIDEO_COMMENT", "POST_LIKE", "POST_COMMENT"],
      required: true,
    },
    referenceId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);