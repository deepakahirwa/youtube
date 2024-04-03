import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Check if name and description are provided
  if (!name || !description) {
    throw new ApiError(400, "Name and Description of Playlist are required");
  }

  // Assuming req.user is expected to exist
  if (!req.user) {
    throw new ApiError(404, "User not found");
  }

  try {
    // Create new playlist
    const newPlaylist = await Playlist.create({
      owner: req.user._id,
      name,
      description,
    });

    // Return success response
    return res
      .status(201)
      .json(
        new ApiResponse(201, newPlaylist, "New playlist created successfully")
      );
  } catch (error) {
    // Handle any database-related errors
    throw new ApiError(500, "Error creating playlist");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if userId is provided
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    // Find user playlists by owner ID
    const userPlaylists = await Playlist.find({ owner: userId });

    // Check if user playlists exist
    if (!userPlaylists || userPlaylists.length === 0) {
      throw new ApiError(404, "User playlists not found");
    }

    // Return success response with user playlists
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userPlaylists,
          "User playlists fetched successfully"
        )
      );
  } catch (error) {
    // Handle any errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError exceptions
    } else {
      throw new ApiError(500, "Error fetching user playlists");
    }
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  try {
    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // Return success response with the playlist
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    // Handle any errors
    throw new ApiError(500, "Error fetching playlist");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  try {
    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // Find the video by ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Add the video to the playlist
    playlist.videos.push(videoId);
    await playlist.save();

    // Return success response
    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    // Handle any errors
    throw new ApiError(500, "Error adding video to playlist");
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  try {
    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // Find the video by ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Check if the user is authorized to remove the video from the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You are not authorized to remove video from playlist"
      );
    }

    // Remove the video from the playlist
    playlist.videos.pull(videoId);
    await playlist.save();

    // Return success response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    // Handle any errors
    throw new ApiError(500, "Error removing video from playlist");
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  try {
    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // Remove the playlist from the database
    await playlist.remove();

    // Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Playlist deleted successfully"));
  } catch (error) {
    // Handle any errors
    throw new ApiError(500, "Error deleting playlist");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  // Check if name or description is provided
  if (!name && !description) {
    throw new ApiError(
      400,
      "Name or Description of Playlist is required for update"
    );
  }

  try {
    // Find the playlist by ID
    let playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // Update the playlist with provided name and/or description
    if (name) {
      playlist.name = name;
    }
    if (description) {
      playlist.description = description;
    }

    // Save the updated playlist
    playlist = await playlist.save();

    // Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
  } catch (error) {
    // Handle any errors
    throw new ApiError(500, "Error updating playlist");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
