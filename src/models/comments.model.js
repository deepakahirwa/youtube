import mongooseAggregatePaginate, { paginate } from "mongoose-paginate-v2";

import mongoose, { Schema } from "mongoose";

const subcomments = new Schema({
  comment_id: {
    type: Schema.Types.ObjectId,
    ref: "Comments",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
  },
});

const CommentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "likes",
      },
    ],
    subcomments: [subcomments],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

CommentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", CommentSchema);
