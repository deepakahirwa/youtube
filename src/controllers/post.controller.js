import mongoose, { isValidObjectId } from "mongoose"
import {Post} from "../models/post.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPost = asyncHandler(async (req, res) => {
    //TODO: create tweet
    
})

const getUserPost = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updatePost = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deletePost = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createPost,
    getUserPost,
    updatePost,
    deletePost
}
