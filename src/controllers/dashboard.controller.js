import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { channel } from "diagnostics_channel";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Get total video views
    const videosViews = await Video.find({ owner: userId }).select("views");
    const totalVideoViews = videosViews.reduce(
      (total, video) => total + video.views,
      0
    );

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({
      channel: userId,
    });

    // Get total videos
    const totalVideos = await Video.countDocuments({ owner: userId });

    // Get total likes and dislikes
    const videosLikesDislikes = await Video.aggregate([
      {
        $match: {
          owner: userId,
        },
      },
      {
        $unwind: "$like_dislike",
      },
      {
        $lookup: {
          from: "likes",
          localField: "like_dislike",
          foreignField: "_id",
          as: "like_dislike",
        },
      },
      {
        $project: {
          like_dislike: 1,
        },
      },
    ]);

    let totalLikes = 0;
    let totalDislikes = 0;
    videosLikesDislikes.forEach((video) => {
      if (video.like_dislike[0] === 1) {
        totalLikes++;
      } else if (video.like_dislike[0] === -1) {
        totalDislikes++;
      }
    });

    // Construct the response object
    const stats = {
      totalVideoViews,
      totalSubscribers,
      totalVideos,
      totalLikes,
      totalDislikes,
    };

    // Send the response
    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Dashboard details fetched successfully")
      );
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(500)
      .json(new ApiError(500, `There is an error: ${error.message}`));
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  try {
    // Check if user exists in request
    if (!req.user) {
      throw new ApiError(404, "User not found in request");
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Find videos uploaded by the channel
    const userVideos = await Video.find({ owner: userId });

    // Find posts uploaded by the channel
    const userPosts = await Post.find({ owner: userId });

    // Check if data is not fetched from MongoDB
    if (!userVideos && !userPosts) {
      throw new ApiError(404, "No data found for the user");
    }

    // Return success response with user videos and posts
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userVideos, userPosts },
          "User dashboard fetched successfully"
        )
      );
  } catch (error) {
    // Handle errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError exceptions
    } else {
      throw new ApiError(500, "Error fetching user dashboard"); // Internal server error for other errors
    }
  }
});

export { getChannelStats, getChannelVideos };
