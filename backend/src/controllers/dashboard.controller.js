import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Likes } from "../models/likes.model.js"
import { User } from "../models/user.model.js"
import { Videos } from "../models/videos.model.js"
import { client } from "../db/redis.js"


//get channel stats and integrating with redis cache
const channelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // Use 'guest' if no user is logged in to ensure cache key uniqueness
    const userId = req.user?._id || 'guest'; 

    if (!mongoose.isValidObjectId(channelId))
        throw new ApiError(400, "Invalid channel ID");

    // Unique key per channel AND user to avoid cache poisoning
    const channelStatsCacheKey = `channel_stats:${channelId}:${userId}`;

    const channelCacheValue = await client.get(channelStatsCacheKey);
    if (channelCacheValue) {
        return res.status(200)
            .json(
                new ApiResponse(200, JSON.parse(channelCacheValue), "Channel stats fetched successfully")
            );
    }

    const channelData = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            // Getting total videos
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "all_videos"
            }
        },
        {
            // Getting total subscribers (with pipeline to get subscriber IDs)
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribedBy",
                pipeline: [{
                    $project: {
                        subscriber: 1 // Required for isSubscribed check
                    }
                }]
            }
        },
        {
            // Get total like count
            $lookup: {
                from: "likes",
                localField: "all_videos._id",
                foreignField: "video",
                as: "all_likes"
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$all_videos" },
                totalSubscribers: { $size: "$subscribedBy" },
                totalViews: { $sum: "$all_videos.views" },
                totalLikes: { $size: "$all_likes" }
            }
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                fullName: 1,
                coverImage: 1,
                totalVideos: 1,
                totalSubscribers: 1,
                totalViews: 1,
                totalLikes: 1,
                isSubscribed: {
                    $in: [
                        new mongoose.Types.ObjectId(req.user?._id),
                        { $map: { input: "$subscribedBy", as: "sub", in: "$$sub.subscriber" } }
                    ]
                }
            }
        }
    ]);

    if (!channelData.length)
        throw new ApiError(500, "Error in fetching the channel stats");

    // Cache with expiry
    await client.setEx(channelStatsCacheKey, 3600, JSON.stringify(channelData[0]));

    return res.status(200)
        .json(
            new ApiResponse(200, channelData[0], "Channel stats fetched successfully")
        );
});

// get channel videos

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.isValidObjectId(channelId))
        throw new ApiError(400, "Invalid channel ID")

    const videos = await Videos.find({
        owner: channelId
    })
        .select("title description owner thumbnail views createdAt duration")
        .populate("owner", "username avatar")
        .sort("-createdAt")
        

    if (!videos)
        throw new ApiError(500, "Error in fetching the videos")
    return res.status(200)
        .json(
            new ApiResponse(200, videos, "Channel videos fetched successfully")
        )
})

export { channelStats, getChannelVideos }