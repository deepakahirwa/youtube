import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const all_comments = await Video.aggregate([
    {
      $match: {
        _id: videoId,
      },
    },
    {
      $unwind: {
        comments: "$comments",
      },
    },
    {
      $lookup: {
        from: "comment",
        localField: "comments",
        foreignField: "_id",
        as: "realComments",
      },
    },
    {
      $limit: limit,
    },
  ]);

  console.log(all_comments);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        all_comments,
        "all comments of videos is fetched successfull"
      )
    );
});

const getPostComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { PostId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const all_comments = await Post.aggregate([
    {
      $match: {
        _id: PostId,
      },
    },
    {
      $unwind: {
        comments: "$comments",
      },
    },
    {
      $lookup: {
        from: "comment",
        localField: "comments",
        foreignField: "_id",
        as: "realComments",
      },
    },
    {
      $limit: limit,
    },
  ]);

  console.log(all_comments);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        all_comments,
        "all comments of Post is fetched successfull"
      )
    );
});

const addVideoComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const userGiven = req.user;
  const { CommentToUpload } = req.body;
  const { videoId } = req.params;
  if (!CommentToUpload) {
    throw new ApiError(404, "comment is empty");
  }
  if (!videoId) {
    throw new ApiError(
      404,
      "video Id is must required for commneting on video"
    );
  }
  if (!userGiven) {
    throw new ApiError(400, "login is required for commeting on video");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video is not present in DB");
  }

  const created_comment = await Comment.create({
    description: CommentToUpload,
    owner: userGiven._id,
  });
  // IN this place we have to apply pipeline for get all comments of video and likes
  video.comments.push(created_comment.id);
  const changedvideo = await video.save();
  //  console.log(changedvideo)
  return res
    .status(200)
    .json(
      new ApiResponse(200, created_comment, "comment is created successfully")
    );
});

const addPostComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const userGiven = req.user;
  const { CommentToUpload } = req.body;
  const { videoId } = req.params;
  if (!CommentToUpload) {
    throw new ApiError(404, "comment is empty");
  }
  if (!videoId) {
    throw new ApiError(
      404,
      "video Id is must required for commneting on video"
    );
  }
  if (!userGiven) {
    throw new ApiError(400, "login is required for commeting on video");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video is not present in DB");
  }

  const created_comment = await Comment.create({
    description: CommentToUpload,
    owner: userGiven._id,
  });
  // IN this place we have to apply pipeline for get all comments of video and likes
  video.comments.push(created_comment.id);
  const changedvideo = await video.save();
  //  console.log(changedvideo)
  return res
    .status(200)
    .json(
      new ApiResponse(200, created_comment, "comment is created successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  const { updated_comment, comment_id } = req.body;
  if (comment_id || updated_comment) {
    throw new ApiError(404, "updated comment or commnet_id is empty");
  }
  if (req.user == undefined) {
    throw new ApiError(404, "user is not found ");
  }
  const comment = await Comment.findById(comment_id);
  if (!comment) {
    throw new ApiError(404, "updated comment or commnet_id is empty");
  }
  if (comment.owner !== req.user._id) {
    throw new ApiError(400, "you the not authorised person for updation");
  }

  comment.description = updated_comment;

  const newUpdatedComment = await comment.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newUpdatedComment, "comment is updated succeefully")
    );
});

// there is need to complete the deleteComment
const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const userGiven = req.user;
  const { comment_id } = req.body;
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(
      404,
      "video Id is must required for commneting on video"
    );
  }
  if (!userGiven) {
    throw new ApiError(400, "login is required for commeting on video");
  }

  // delete comment which is stored in comment array of video
  const video = await Video.find(video);

  if (!video) {
    throw new ApiError(400, "video is not present in DB");
  }
  const Deleted_comment = await Comment.findByIdAndDelete(comment_id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, Deleted_comment, "comment is deleted succefully")
    );
});

export {
  getVideoComments,
  addVideoComment,
  addPostComment,
  updateComment,
  deleteComment,
  getPostComments,
};
