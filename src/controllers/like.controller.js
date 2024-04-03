import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/likes.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const value = req.body;
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

  const value = req.body;
  //TODO: toggle like on video
  if (!commentId) {
    throw new ApiError(404, "videId not found");
  }
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }
  const comment = await Video.findById(commentId);
  if (!comment) {
    throw new ApiError(404, " video is not present in Db");
  }

  const likedComment = await Like.create({
    owner: req.user._id,
    value: value,
  });
  comment.like_dislike.push(likedVideo.id);
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, likedComment, "like is toggled successfully"));
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { PostId } = req.params;
  const value = req.body;
  //TODO: toggle like on video
  if (!PostId) {
    throw new ApiError(404, "videId not found");
  }
  if (!req.user) {
    throw new ApiError(404, " user not found");
  }
  const post = await Video.findById(PostId);
  if (!post) {
    throw new ApiError(404, " video is not present in Db");
  }

  const likedpost = await Like.create({
    owner: req.user._id,
    value: value,
  });
  post.like_dislike.push(likedpost.id);
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
        _id: new mongoose.Types.ObjectId(req.user._id),
        value: 1,
      },
    },

    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "comments",
        as: "videos",
        pipeline: [
          {
            $unwind: "$comments",
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, liked_videos, "fetched liked videos successfully")
    );
});

export { toggleCommentLike, togglePostLike, toggleVideoLike, getLikedVideos };
