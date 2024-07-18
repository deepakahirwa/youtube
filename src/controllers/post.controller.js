import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { deleteOncloudinary } from "../utils/deleteoncloudinary.js";



const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const user = req.user;
  const posts = req.files;
  let postLinks = [];

  // Check if caption is provided
  if (!caption) {
    throw new ApiError(400, "Caption is required for the post");
  }

  // Check if there are any files uploaded
  if (!posts || posts.length === 0) {
    throw new ApiError(400, "Photos are required for the post");
  }

  try {
    // Iterate over each uploaded file
    for (const element of posts) {
      const pathForUpload = element.path;
      const uploadedFile = await uplaodOnCloudinary(pathForUpload);

      // Check if the file uploaded successfully
      if (uploadedFile && uploadedFile.url) {
        postLinks.push(uploadedFile.url);
      } else {
        // If there was an error uploading, delete already uploaded files and throw an error
        postLinks.forEach(async (link) => {
          await deleteOncloudinary(link);
        });
        throw new ApiError(
          500,
          "There was a problem while uploading files to cloud"
        );
      }
    }

    // Create post in database
    const newPost = await Post.create({
      owner: user._id,
      content: postLinks,
      description: caption,
    });

    // Return success response with created post
    return res
      .status(200)
      .json(new ApiResponse(200, newPost, "Post created successfully"));
  } catch (error) {
    // If there's an error during post creation, delete uploaded files and throw error
    postLinks.forEach(async (link) => {
      await deleteOncloudinary(link);
    });
    throw new ApiError(500, "Error creating post");
  }
});

const getUserPost = asyncHandler(async (req, res) => {
  // TODO: get user posts
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const userPosts = await Post.find({
    owner: userId,
  });

  // Check if user posts exist
  if (!userPosts || userPosts.length === 0) {
    console.log("No posts");
    res
    .status(200)
    .json(new ApiResponse(200, userPosts, "post is not uploaded by you"));
  }

  // Return success response with user posts
  res
    .status(200)
    .json(new ApiResponse(200, userPosts, "Posts fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  try {
    //TODO: update post

    const { deletionIndex, newCaption } = req.body;
    console.log(deletionIndex);
    const { postId } = req.params;
    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // Check if the user is authorized to update the post
    if (post.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to update this post");
    }

    // Update the caption
    post.description = newCaption;

    // Remove content based on deletionIndex
    if (deletionIndex !== undefined) {
      for (const index of deletionIndex) {
        const urlFordelete = post.content.splice(index, 1);
        await deleteOncloudinary(urlFordelete);
      }
    }

    // Save the updated post
    const updated_post = await post.save();
    console.log(updated_post);
    // Return success response
    res
      .status(200)
      .json(new ApiResponse(200, updated_post, "Post updated successfully"));
  } catch (error) {
    // Handle errors
    console.error("Error in updating post:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const deletePost = asyncHandler(async (req, res) => {
  //TODO: delete post
  const { postId } = req.params;

  try {
    if (!postId) {
      throw new ApiError(400, "Post ID is required");
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // Check if the user is the owner of the post
    if (post.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this post");
    }

    // Delete the associated content (assuming it's stored in cloudinary)
    const postLinks = post.content;
    for (const link of postLinks) {
      await deleteOncloudinary(link);
    }
    await Post.findByIdAndDelete(postId);
    // Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    // Handle any errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError exceptions
    } else {
      throw new ApiError(500, "Error deleting post");
    }
  }
});

export { createPost, getUserPost, updatePost, deletePost };
