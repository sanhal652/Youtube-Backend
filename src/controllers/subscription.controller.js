import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";


//toggle subscription status 
const toggleSubscriptionStatus= asyncHandler(async (req,res) => {
    const {channelId}= req.params
    if(!mongoose.isValidObjectId(channelId))
        throw new ApiError(400,"Invalid channel ID")

    //check the current status of user(subscribed or unsubscribed)
    const existingSubscription= await Subscription.findOne({
        subscriber:req.user?._id,
        channel:channelId
    })

    //if the user is already subscribed then delete subscription and delete the record from database

    if(existingSubscription)
    {
        const deletedSubscription= await Subscription.findOneAndDelete(existingSubscription._id)
        if(!deletedSubscription)
            throw new ApiError(500,"Error in deleting subscription")
        return res.status(200)
        .json(
            new ApiResponse(200,{},"User unsubscribed successfully")
        )
    }

    else{
        const newSubscription= await Subscription.create({
            subscriber:req.user?._id,
            channel:channelId
        })

        if(!newSubscription)
            throw new ApiError(500,"Error in subscribing channel")

        const subscriber= await User.findById(req.user?._id)
        const io=req.app.get("io")
        const userSocketMap= req.app.get("userSocketMap")

        if(subscriber && subscriber._id.toString())
        {
            const receiverSocketId= userSocketMap[channelId]

            if(receiverSocketId)
            {
                io.to(receiverSocketId).emit("notification",{
                    message:"Somebody subscribed to your channel",
                    from:{
                        _id:req.user?._id,
                        username:req.user?.username,
                        avatar:req.user?.avatar
                    }
                })
            }
        }

        return res.status(201)
        .json(
            new ApiResponse(201, newSubscription,"User subscribed successfully")
        )
    }
})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!mongoose.isValidObjectId(channelId))
        throw new ApiError(400,"Invalid channel ID")

    const subscriberList= await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1,
                            fullName:1
                        }
                    }
                ]
            }
        },{
            $addFields:{
                subscriber:{
                    $first:"$subscriber"
                }
            }
        }
    ])

    if(!subscriberList)
        throw new ApiError(500,"Unable to fetch subscriber list")

    return res.status(200)
    .json(
        new ApiResponse(200,subscriberList,"Subscriber list fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const userId = req.user?._id
     if(!mongoose.isValidObjectId(userId))
        throw new ApiError(400,"Invalid subscriber ID")
    const channelsSubscribed= await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedTo",
                 pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1,
                            fullName:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                subscribedTo:{
                    $first:"$subscribedTo"
                }
            }
        }
    ])

    // if(!channelsSubscribed)
    //     throw new ApiError(500,"Unable to fetch channels subscribed to  list")

     return res.status(200)
    .json(
        new ApiResponse(200,channelsSubscribed,"Channel list fetched successfully")
    )    
})
export { toggleSubscriptionStatus,getUserChannelSubscribers,getSubscribedChannels }