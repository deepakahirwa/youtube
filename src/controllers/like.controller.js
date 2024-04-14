import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/likes.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comments.model.js";
import { Post } from "../models/post.model.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { value } = req.body;

  if (value === undefined || typeof value !== "number") {
    throw new ApiError(404, " plz provide right value");
  }
  //TODO: toggle like on video
  if (!videoId) {
    throw new ApiError(404, "videId not found");
  }
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, " video is not present in Db");
  }

  const likedVideo = await Like.create({
    owner: req.user._id,
    value: value,
    type: 1,
  });
  video.like_dislike.push(likedVideo.id);
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideo, "like is toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  const { value } = req.body;
  //TODO: toggle like on video
  if (!commentId) {
    throw new ApiError(404, "commentId not found");
  }
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, " video is not present in Db");
  }

  const likedComment = await Like.create({
    owner: req.user._id,
    value: value,
    type: 0,
  });
  comment.likes.push(likedComment.id);
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, likedComment, "like is toggled successfully"));
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { value } = req.body;
  if (postId === undefined) {
    throw new ApiError(404, "PostId not found");
  }
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, " Post is not present in Db");
  }

  const likedpost = await Like.create({
    owner: req.user._id,
    value: value,
    type: -1,
  });
  post.likes.push(likedpost.id);
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, likedpost, "like is toggled successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }

  const liked_videos = await Like.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
        value: "1",
        type: 1,
      },
    },

    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "like_dislike",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 1,
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              duration: 1,
              views: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        owner: 1,
        videos: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, liked_videos, "fetched liked videos successfully")
    );
});

const getLikedPost = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }

  const liked_videos = await Like.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
        value: "1",
        type: -1,
      },
    },

    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "likes",
        as: "post",
        pipeline: [
          {
            $project: {
              _id: 1,
              content: 1,
              description: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        owner: 1,
        post: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, liked_videos, "fetched liked videos successfully")
    );
});

export {
  toggleCommentLike,
  togglePostLike,
  toggleVideoLike,
  getLikedVideos,
  getLikedPost,
};
