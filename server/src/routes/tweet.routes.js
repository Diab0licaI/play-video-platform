import { Router } from 'express';
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.route("/").get(getAllTweets);
router.route("/user/:userId").get(getUserTweets);

// Protected
router.route("/").post(verifyJWT, createTweet);
router.route("/:tweetId").patch(verifyJWT, updateTweet);
router.route("/:tweetId").delete(verifyJWT, deleteTweet);

export default router;