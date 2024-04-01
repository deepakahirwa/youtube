import mongooseAggregatePaginate from "mongoose-paginate-v2";

import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
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


// post.model.js

export const post = mongoose.model('Post', PostSchema);
