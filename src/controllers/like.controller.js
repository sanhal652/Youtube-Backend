import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Likes } from "../models/likes.model.js"

//toggle like status in video
const toggleVideoLike= asyncHandler(async (req,res) => {
    const {videoId} = req.params
    if(!mongoose.isValidObjectId(videoId))
            throw new ApiError(400,"Invalid video ID")
    const alreadyLiked= await Likes.findOne({
        video:videoId,
        likedBy:req.user?._id
    })

    if(alreadyLiked)
    {
        const removeLike= await Likes.findByIdAndDelete(alreadyLiked._id)
        if(!removeLike)
            throw new ApiError(500,"Error in removing like")
        return res.status(200)
        .json(
            new ApiResponse(200,{isLiked:false},"Video unliked successfully")
        )
    }
    else{
        const addLike= await Likes.create({
            video:videoId,
            likedBy:req.user?._id
        })
        if(!addLike)
            throw new ApiError(500,"Error in liking the video")
        return res.status(200)
        .json(
            new ApiResponse(200,{...addLike._doc, isLiked:true},"Video liked successfully")
        )
    }
})

//toggle likes on tweet
const toggleTweetLike= asyncHandler(async (req,res) => {
    const {tweetId} = req.params
    if(!mongoose.isValidObjectId(tweetId))
            throw new ApiError(400,"Invalid tweet ID")
    const alreadyLiked= await Likes.findOne({
        tweet:tweetId,
        likedBy:req.user?._id
    })

    if(alreadyLiked)
    {
        const removeLike= await Likes.findByIdAndDelete(alreadyLiked._id)
        if(!removeLike)
            throw new ApiError(500,"Error in removing like")
        return res.status(200)
        .json(
            new ApiResponse(200,{isLiked:false},"Tweet unliked successfully")
        )
    }
    else{
        const addLike= await Likes.create({
            tweet:tweetId,
            likedBy:req.user?._id
        })
        if(!addLike)
            throw new ApiError(500,"Error in liking the tweet")
        return res.status(200)
        .json(
            new ApiResponse(200,{...addLike._doc, isLiked:true},"Tweet liked successfully")
        )
    }
})

//toggle likes on comment
const toggleCommentLike= asyncHandler(async (req,res) => {
    const {commentId}= req.params
    if( !mongoose.isValidObjectId(commentId))
            throw new ApiError(400,"Invalid comment ID")
    const alreadyLiked= await Likes.findOne({
        comment:commentId,
        likedBy:req.user?._id
    })

    if(alreadyLiked)
    {
        const removeLike= await Likes.findByIdAndDelete(alreadyLiked._id)
        if(!removeLike)
            throw new ApiError(500,"Error in removing like from comment")
        return res.status(200)
        .json(
            new ApiResponse(200,{isLiked:false},"Comment unliked successfully")
        )
    }
    else{
        const addLike= await Likes.create({
            comment:commentId,
            likedBy:req.user?._id
        })
        if(!addLike)
            throw new ApiError(500,"Error in liking the comment")
        return res.status(200)
        .json(
            new ApiResponse(200,{...addLike._doc, isLiked:true},"Comment liked successfully")
        )
    }

})

// get liked videos

const getLikedVideos= asyncHandler(async (req,res) => {
    const userId = req.user?._id
    const allVideos= await Likes.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(userId),
                video:{$exists:true}
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[{
                                $project:{
                                    username:1,
                                    avatar:1
                                }
                            }]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                video:{
                    $first:"$video"
                }
            }
        },
        {
        // This makes the 'video' object the root of the result
            $replaceRoot: { newRoot: "$video" }
    
        }
    ])
    if(!allVideos)
        throw new ApiError(500,"Error in fetching  liked videos")
    return res.status(200)
    .json(
        new ApiResponse(200,allVideos," Liked Videos fetched successfully")
    )


})

export { toggleVideoLike,toggleTweetLike, toggleCommentLike, getLikedVideos }