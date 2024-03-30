import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import { deleteOncloudinary } from "../utils/deleteoncloudinary.js";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    // Retrieve user by ID
    const user = await User.findById(userId);

    // Ensure user exists
    if (!user) {
      throw new Error(401, "User not found");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(accessToken,refreshToken);
    // Update user's refresh token
    user.refreshToken = refreshToken;

    // Save user (skip validation)
    await user.save({ validateBeforeSave: false });

    // Return tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Handle errors
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Internal server error while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // const {fullName, email} = req.body;
  // console.log(fullName, email);
  // res.status(200).json({
  //     message : "ok"
  // })

  // Algorithm for work that we have do in registerUser

  // 1 get user details from front-end
  // 2 validation -not empty
  // 3 check if user already exists : username and email
  // 4 check for image and avatar and whether entered or not
  // 5 upload photos on cloudinary
  // 6 store data of user in DB
  // 7 remove password and tokens then send response to front-end
  // 8 check for user created or not
  // 9 return res

  const { fullname, email, username, password } = req.body;

  // validation -not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are reuired");
  }

  // 3checking for new user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // if the user is existed already in data base
  if (existedUser) {
    throw new ApiError(409, "User exist already with email or username");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("path of avatar", avatarLocalPath);
  let coverImageLocalPath;
  //   const coverImageLocalPath = req.files.coverImage[0]?.path;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is must for register");
  }

  const avatar = await uplaodOnCloudinary(avatarLocalPath);
  const coverImage = await uplaodOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is must for register");
  }

  const user = await User.create({
    username,
    email,
    fullname,
    avatar: avatar.url,
    coverimage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Someting is went wrong with server");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registerd successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Algorithm for login a user
  // 1. req body ->DataTransfer
  // 2. check for valid username or email in DB
  // 3. find user in DB
  // 4. password check in Db
  // 5. access and refresh token
  // 6. send cookie
  // 7.

  const { username, password, email } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "username or email required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  // console.log(user.methods);
  const isPasswordValid = await user.isPasswordCorrect(password);
  // console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(400, "invalid usrname or password");
  }
  // console.log(user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  // console.log(accessToken,refreshToken);
  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );
  //  console.log(loggedInUser);
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User is logouted successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  //TODO: delete old image - assignment
  const delete_res = await deleteOncloudinary(user.avatar);
  console.log(delete_res);
  const avatar = await uplaodOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  //TODO: delete old image - assignment
  const delete_res = await deleteOncloudinary(user.avatar);
  const coverImage = await uplaodOnCloudinary(coverImageLocalPath);
  console.log(delete_res);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw ApiError(401, "user name is missing");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "Subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "SubscribedByU",
      },
    },
    {
      $addFields: {
        No_of_subscriber: {
          $size: "$Subscribers",
        },
        No_of_channel_subscribed: {
          $size: "$SubscribedByU",
        },
      },
    },
    {
      is_subscribed: {
        $cond: {
          if: { $in: [req.user?._id, "$Subscriber.subscriber"] },
          then: true,
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        No_of_subscriber: 1,
        No_of_channel_subscribed: 1,
        is_subscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);
  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(404, "chennel doesn't exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "channel is fetched successfully"));
});

const getUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const UserHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watched_videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
            pipeline:[
              {
                $project:{
                  fullName:1,
                  avatar:1,
                  coverImage:1,
                  username:1
                }
              }
            ]

          },
          {
            $addFields:{
              owner:{
                $first : "$owner"
              }
            }
          }
        ],
      },
    },
    {},
  ]);

   return res.status(200).
   json(new ApiResponse(200,UserHistory[0],"watched history is fetched successfully"))
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserProfile,
  getUserHistory
};
