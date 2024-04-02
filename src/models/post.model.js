import mongooseAggregatePaginate from "mongoose-paginate-v2";

import mongoose, { Schema } from "mongoose";

export const PostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Likes",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    content: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

PostSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model("Post", PostSchema);
