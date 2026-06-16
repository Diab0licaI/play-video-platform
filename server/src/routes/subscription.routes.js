import { Router } from 'express';
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  getSubscriptionStatus,
  getSubscriptionFeed,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/feed").get(getSubscriptionFeed);
router.route("/:channelId").get(getSubscriptionStatus);
router.route("/:channelId").post(toggleSubscription);
router.route("/c/:channelId").get(getUserChannelSubscribers);
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;