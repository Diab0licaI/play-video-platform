import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getNotifications);
router.patch("/:notificationId/read", markAsRead);

export default router;