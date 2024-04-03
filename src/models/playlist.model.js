import mongooseAggregatePaginate, { paginate } from "mongoose-paginate-v2";

import mongoose, { Schema } from "mongoose";

const PlaylistSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Likes",
      },
    ],
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

PlaylistSchema.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model("Playlist", PlaylistSchema);
