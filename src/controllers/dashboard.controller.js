import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Likes } from "../models/likes.model.js"
import { User } from "../models/user.model.js"
import { Videos } from "../models/videos.model.js"

//get channel stats

const channelStats= asyncHandler(async (req,res) => {
    const {channelId}= req.params
    if(!mongoose.isValidObjectId(channelId))
        throw new ApiError(400,"Invalid channel ID")
    const channelData= await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            //getting total videos
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"all_videos"
            }
        },
        {
            //getting total subscribers
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribedBy",
                pipeline:[{
                    $project:{
                        username:1,
                        avatar:1,
                        fullName:1
                    }
                }]
            }
        },
        {
            //get total like count
            $lookup:{
                from:"likes",
                localField:"all_videos._id",
                foreignField:"video",
                as:"all_likes"
            }
        },
        {
            $addFields:{
                totalVideos:{
                    $size:"$all_videos"
                },
                totalSubscribers:{
                    $size:"$subscribedBy"
                }, 
                totalViews:{
                    $sum:"$all_videos.views"
                },
                totalLikes:{
                    $size:"$all_likes"
                }
            }
        },
        {
            $project:{
                username:1,
                avatar:1,
                fullName:1,
                totalVideos:1,
                totalSubscribers:1,
                totalViews:1,
                totalLikes:1
            }
        }
    ])

    if(!channelData)
        throw new ApiError(500,"Error in fetching the channel stats")
    return res.status(200)
    .json(
        new ApiResponse(200,channelData[0],"Channel stats fetched successfully")
    )
})

// get channel videos

const getChannelVideos= asyncHandler(async (req,res) => {
    const {channelId} = req.params
    if(!mongoose.isValidObjectId(channelId))
        throw new ApiError(400,"Invalid channel ID")

    const videos= await Videos.find({
        owner:channelId
    })
    .select("title description owner thumbnail")
    .sort("-createdAt")
    
    if(!videos)
        throw new ApiError(500,"Error in fetching the videos")
    return res.status(200)
    .json(
        new ApiResponse(200,videos,"Channel videos fetched successfully")
    )
})

export { channelStats,getChannelVideos }