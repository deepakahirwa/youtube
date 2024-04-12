import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { deleteOncloudinary } from "../utils/deleteoncloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  await Video.find({})
    .then((videos) => {
      return res
        .status(200)
        .json(new ApiResponse(200, videos, "all videos fetched successfully"));
    })
    .catch((error) => {
      res
        .status(404)
        .json(new ApiError(404, `error in fetching videos ${error}`));
    });
});
// there is error in publishing the video, multer middleware is not working
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;
  if (!user._id) {
    throw new ApiError(401, "unathorised access to upload videos");
  }
  if (!title || !description) {
    throw new ApiError(400, "title and description all are required");
  }
  // console.log(req.files);
  const video_localpath = req.files?.videoFile[0]?.path;
  //   const thumbnail_localpath = user?.videoFile[0]?.path;  // its for if you only if both files is to upload
  console.log(video_localpath);
  let thumbnail_localpath = req.files?.thumbnail[0]?.path;
  //   const coverImageLocalPath = req.files.coverImage[0]?.path;
  let thumbnail = null;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files?.thumbnail.length > 0
  ) {
    thumbnail_localpath = req.files?.thumbnail[0]?.path;
    thumbnail = await uplaodOnCloudinary(thumbnail_localpath);
  }

  const video = await uplaodOnCloudinary(video_localpath);

  if (!video || !thumbnail) {
    throw new ApiError(500, "error in uploading the content on Cloud ");
  }

  const isPublic = req.body?.isPublic || true;
  console.log(thumbnail.url, video.url);
  const createVideo = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: video.duration,
    isPublished: isPublic,
    owner: req.user._id,
  });

  if (!createVideo) {
    throw new ApiError(500, "error in uploading the details on mongoDB ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createVideo, "video is uploaded succesfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video_id is must required for this Api");
  }
  const response = await Video.findById(videoId);
  if (!res) {
    throw ApiError(400, "error in finding video in mongoDb");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "video is fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description, isPublic } = req.body;
  if (!videoId) {
    throw new ApiError(400, "video_id is must required for this Api");
  }
  if (!req.user) {
    throw new ApiError(404, "unauthorised request");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not present in DB");
  }
  // console.log(req.user._id, video.owner);
  if (req.user._id.toString() !== video.owner.toString()) {
    throw new ApiError(
      401,
      "unauthorised request you are not owner for this video"
    );
  }
  let flage = true;
  if (isPublic !== undefined) {
    video.isPublished = isPublic;
    flage = false;
  }
  if (title) {
    video.title = title;
    flage = false;
  }
  if (description) {
    video.description = description;
    flage = false;
  }

  if (req?.file || req.file?.path) {
    const cloud_delete = deleteOncloudinary(video.thumbnail);
    console.log(cloud_delete);
    const thumbnail_url = await uplaodOnCloudinary(req.file.path);
    video.thumbnail = thumbnail_url.url;
    flage = false;
  }
  // console.log(flage);
  if (flage) {
    throw new ApiError(404, "nothing has updated");
  }
  const updated_video = await video.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, updated_video, "video isupdated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(400, "video_id is must required for this Api");
  }
  if (!req.user) {
    throw new ApiError(404, "unauthorised request");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not present in DB");
  }
  // console.log(req.user._id, video.owner);
  if (req.user._id.toString() !== video.owner.toString()) {
    throw new ApiError(
      401,
      "unauthorised request you are not owner for this video"
    );
  }

  const cloud_delete_video = await deleteOncloudinary(video.videoFile);
  const cloud_delete_thumbnail = await deleteOncloudinary(video.thumbnail);
  const deleted_video = await Video.findByIdAndDelete(videoId);
  // console.log(deleted_video);

  console.log(cloud_delete_video, cloud_delete_thumbnail);
  return res
    .status(200)
    .json(new ApiResponse(200, deleted_video, "video is deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "video_id is must required for this Api");
  }
  if (!req.user) {
    throw new ApiError(404, "unauthorised request");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not present in DB");
  }
  // console.log(req.user._id, video.owner);
  if (req.user._id.toString() !== video.owner.toString()) {
    throw new ApiError(
      401,
      "unauthorised request you are not owner for this video"
    );
  }
  const isPublic = await Video.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: !video.isPublished,
    },
  });
  console.log(isPublic);

  return res
    .status(200)
    .json(new ApiResponse(200, isPublic, "is_published fetched successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
