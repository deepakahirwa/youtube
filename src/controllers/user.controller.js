import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cookieParser from "cookie-parser";



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
    return {accessToken,refreshToken};
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
  const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(
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
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "User is logouted successfully"));
});

export { registerUser, loginUser, logoutUser };
