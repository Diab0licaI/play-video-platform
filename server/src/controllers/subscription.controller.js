import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Notification } from "../models/notification.model.js";


const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existing = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existing) {
    await Subscription.findByIdAndDelete(existing._id);
    return res.status(200).json(
      new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
    );
  } else {
    await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });

    await Notification.create({
      recipient: channelId,
      sender: subscriberId,
      type: "SUBSCRIBE",
    });

    return res.status(200).json(
      new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
    );
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "fullName username avatar");

  const subscriberCount = subscribers.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      { subscribers, subscriberCount },
      "Subscribers fetched successfully"
    )
  );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "fullName username avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      subscriptions,
      "Subscribed channels fetched successfully"
    )
  );
});

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  const isSubscribed = !!(await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      { subscribed: isSubscribed, subscriberCount },
      "Subscription status fetched"
    )
  );
});
const getSubscriptionFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all channels the user subscribed to
  const subscriptions = await Subscription.find({
    subscriber: userId,
  }).select("channel");

  const channelIds = subscriptions.map((sub) => sub.channel);

  if (channelIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No subscriptions found")
    );
  }

  // Get videos from those channels
  const videos = await Video.find({
    owner: { $in: channelIds },
    isPublished: true,
  })
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, videos, "Subscription feed fetched successfully")
  );
});

// add to exports
export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  getSubscriptionStatus,
  getSubscriptionFeed,
};