import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  searchVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ====================
// PUBLIC ROUTES (specific first)
// ====================
router.route("/").get(getAllVideos);

router.route("/search/:query").get(searchVideos);

// ✅ Static/specific routes BEFORE dynamic /:videoId
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

// ====================
// PROTECTED ROUTES
// ====================
router.route("/").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

// ✅ Chain .get .patch .delete on the SAME route() call
router
  .route("/:videoId")
  .get(getVideoById)                                        // public
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo) // protected
  .delete(verifyJWT, deleteVideo);                          // protected

export default router;