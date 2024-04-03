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
  if (!is_subcriber) {
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
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(404, "Channel ID is not provided");
  }
  const all_subscribers = await find({ channel: channelId });
  if (!all_subscribers) {
    throw new ApiError(500, "Error fetching subscribers from the database");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, all_subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed


const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(404, "Subscriber ID is not provided");
  }
  const all_channels = await find({ subscriber: subscriberId });
  if (all_channels.length === 0) {
    throw new ApiError(404, "No channels found for the subscriber");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        all_channels,
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
