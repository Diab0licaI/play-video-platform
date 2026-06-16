import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addToHistory,
  getHistory,
  removeFromHistory,
  clearHistory,
} from "../controllers/watchHistory.controller.js";

const router = Router();

router.use(verifyJWT); // all routes require auth

router.route("/").get(getHistory).delete(clearHistory);

router.route("/:videoId").post(addToHistory).delete(removeFromHistory);

export default router;