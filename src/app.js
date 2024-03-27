import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true

}));


//  use a middleware for json DataTransfer
app.use(express.json({limit:"16kb",}));

//  use a middleware for  DataTransfer from url
app.use(express.urlencoded({extended:true,limit : "16kb"}))

//  use a middleware for public asset for storing the public data
app.use(express.static("public"))

//  use a middleware for cookie storing and deleting
app.use(cookieParser());


/// router import

import userRouter from "./routes/user.routes.js"

// route declaration
app.use("/api/v1/users", userRouter)

export {app};