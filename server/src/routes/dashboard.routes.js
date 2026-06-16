import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// ← add this
router.use((req, res, next) => {
  console.log("DASHBOARD ROUTE HIT:", req.method, req.originalUrl);
  next();
});

router.use(verifyJWT);

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router