import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2";
const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
subscriptionSchema.plugin(mongooseAggregatePaginate);
export const Subscription = mongoose.model("Subcription", subscriptionSchema);
