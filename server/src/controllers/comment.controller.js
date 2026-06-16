import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(
  async (req, res) => {
    const { videoId } = req.params;

    const comments = await Comment.find({
      video: videoId,
    })
      .populate(
        "owner",
        "fullName username avatar"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        200,
        comments,
        "Comments fetched successfully"
      )
    );
  }
);

const addComment = asyncHandler(
  async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new ApiError(
        400,
        "Comment is required"
      );
    }

    const comment =
      await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
      });

    // Create a notification for the video owner
    const video = await Video.findById(videoId).select("owner");
    if (video && video.owner.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: video.owner,
        sender: req.user._id,
        type: "VIDEO_COMMENT",
        referenceId: videoId,
      });
    }
    return res.status(201).json(
      new ApiResponse(
        201,
        comment,
        "Comment added successfully"
      )
    );
  }
);

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found"
        );
    }

    if (
        comment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can delete only your own comments"
        );
    }

    await Comment.findByIdAndDelete(
        commentId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    const comment = await Comment.findById(
        commentId
    );

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found"
        );
    }

    if (
        comment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can edit only your own comments"
        );
    }

    comment.content = content;

    await comment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    );
});

export {
  getVideoComments,
  addComment,
  deleteComment,
  updateComment,
};