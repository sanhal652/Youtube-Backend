import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { Tweet } from "../models/tweets.model.js"
import { User } from "../models/user.model.js";

// add new tweet
const addTweet= asyncHandler(async(req,res)=>{
    const {content} = req.body
    if(!content || content.trim()==="")
        throw new ApiError(400,"Content is required")
    const tweet= await Tweet.create({
        content:content.trim(),
        owner:req.user?._id
    })
    if(!tweet)
        throw new ApiError(500,"Error in adding tweet")
    return res.status(201)
    .json(
       new ApiResponse( 201,tweet,"Tweet added successfully")
    )
})


//update tweet
const updateTweet= asyncHandler(async (req,res) => {
    const {tweetId} =req.params
    const {content} =req.body
    if(!content || content.trim()==="")
        throw new ApiError(400,"Content is required")
    const tweet = await Tweet.findById(tweetId)
    if(!tweet)
        throw new ApiError(404,"Tweet does not exist")
    if(tweet.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorized access, cant update tweet")
    tweet.content=content
    const updatedTweet=await tweet.save({validateBeforeSave:false})
    if(!updatedTweet)
        throw new ApiError(500,"Error in updating tweet, please try again later")
    return res.status(200)
    .json(
        new ApiResponse(200,updatedTweet,"Tweet updated successfully")
    )
})

//delete tweet
const deleteTweet= asyncHandler(async (req,res) => {
    const {tweetId} =req.params
    const tweet = await Tweet.findById(tweetId)
    if(!tweet)
        throw new ApiError(404,"Tweet does not exist")
    if(tweet.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorized access, cant delete tweet")
    const deletedTweet= await Tweet.findByIdAndDelete(tweetId)
    if(!deletedTweet)
        throw new ApiError(500,"Error in deletingtweet, please try again later")
    return res.status(200)
    .json(
        new ApiResponse(200,{},"Tweet deleted successfully")
    )
})

//get user tweets
const getUserTweets= asyncHandler(async (req,res) => {
    const {userId} =req.params
    if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User ID format")
}
    const userTweets= await Tweet.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])
    if(!userTweets)
        throw new ApiError(500,"Error in fetching tweets")
    return res.status(200)
    .json(
        new ApiResponse(200,userTweets,"Tweets fetched successfully")
    )
})

export { addTweet,updateTweet,deleteTweet,getUserTweets }