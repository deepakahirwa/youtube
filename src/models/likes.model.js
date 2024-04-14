import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2";
import { type } from "os";
const LikeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: String,
      enum: [-1, 0, 1],
      default: 0,
    },
    type: {
      type: Number,
      enum: [1, 0, 2, -1],
      default: 0,
    },
  },
  { timestamps: true }
);

LikeSchema.plugin(mongooseAggregatePaginate);

export const Like = mongoose.model("Like", LikeSchema);
