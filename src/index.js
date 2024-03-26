import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
.then((result) => {
      app.listen(process.env.PORT ||4000,()=>{
          console.log(`Server is running on ${process.env.PORT}`);
      })
}).catch((err) => {
    console.log(`error in connecting the DB ${err}`);
});;

// require('dotenv').config({path:'./env'})
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
//            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
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
