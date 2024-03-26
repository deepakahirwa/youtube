
import dotenv from "dotenv";
import mongoose  from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB();
















// // require('dotenv').config({path:'./env'})
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { DB_NAME } from "./constants.js";
// import  Express  from "express";
// dotenv.config({
//     path: './env'
// })

// const app = Express();

// (async()=>{
//     try {
//            await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//            app.on("error",()=>{
//             console.log("error",error);
//             throw error
//            })

//            app.listen(process.env.PORT,()=>{
//                   console.log(`app is listening on ${process.env.PORT}`)
//            })

//     } catch (error) {
//         console.error("error in connection",error);
//         throw error
//     }
// })()