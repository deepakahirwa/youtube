import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // console.log("authmiddleware",req.cookies);
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(Token);

    if (!Token) {
      throw new ApiError(401, "unauthorised request");
    }

    const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-refreshToken -password"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access is provided by you");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "error is coming from jsw verfication"
    );
  }
});

export { verifyJWT };

// import { verify } from "jsonwebtoken";
// const JWT_secret = "this-is-secret-key";
// const fetchuser = (req, res, next) => {
//   // get the user from the jwt token and add id to req object
//   const token = req.header("auth-token");
//   if (!token) {
//     res.status(401).send({ Error: "please authentication using valid token" });
//   }
//   try {
//     const data = verify(token, JWT_secret);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ Error: "please authentication using valid token" });
//   }
// };

// export default fetchuser;

// import jwt from "jsonwebtoken"
