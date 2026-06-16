import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id,
  })
    .populate("sender", "fullName username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched")
  );
});

const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  await Notification.findByIdAndUpdate(notificationId, { isRead: true });

  return res.status(200).json(
    new ApiResponse(200, {}, "Marked as read")
  );
});

export { getNotifications, markAsRead };