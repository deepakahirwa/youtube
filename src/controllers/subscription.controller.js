import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!req.user) {
    throw new ApiError(404, "user is not authorised for subcribe");
  }
  const is_subcriber = await Subscription.find({
    channel: channelId,
    subscriber: req.user._id,
  });
  let data_for_return;
  // console.log(is_subcriber);
  if (is_subcriber.length !== 0) {
    data_for_return = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req.user._id,
    });
  } else {
    data_for_return = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, data_for_return, "subcription toggled successfully")
    );
});

// controller to return subscriber list of a channel

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (subscriberId === undefined) {
    throw new ApiError(404, "Channel ID is not provided");
  }

  const all_subscribers = await Subscription.find({ channel: subscriberId });
  if (all_subscribers.length === 0) {
    throw new ApiError(
      500,
      "Error fetching subscribers from the database or you have not any subscriber"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, all_subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.user._id;

  // console.log(new mongoose.Types.ObjectId(req.user._id));
  // if (subscriberId === "") {
  //   throw new ApiError(404, "Subscriber ID is not provided");
  // }
  const all_channels = await Subscription.find({ subscriber: req.user._id });
  const following = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(req.user._id),
        // value: "1",
        // type: 1,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "friends",
        pipeline: [
          {
            '$project': {
              _id: 1,
              avatar: 1,
              fullname: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        friends: 1
      }
    }
  ])
  if (all_channels.length === 0) {
    throw new ApiError(404, "No channels found for the subscriber");
  }

 console.log(following[0].friends[0]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        following[0].friends,
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
