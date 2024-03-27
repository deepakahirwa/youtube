import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
export default registerUser;
