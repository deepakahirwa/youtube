import mongoose from "mongoose";
import { PostSchema } from "./post.model";




export const Post = mongoose.model('Post', PostSchema);
