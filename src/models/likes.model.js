import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", LikeSchema);
