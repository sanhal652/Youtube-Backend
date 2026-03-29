import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { Comment } from "../models/comments.model.js"
import { Videos } from "../models/videos.model.js"
import mongoose from "mongoose";
import { client } from "../db/redis.js"


//create new comment
const addComment= asyncHandler(async (req,res) => {
    const {videoId} = req.params 
    const {content}=req.body
    
    if(!content)
        throw new ApiError(404,"Content is empty")
    const video= await Videos.findById(videoId)
    if(!video)
        throw new ApiError(404,"Video does not exist")
    const comment= await Comment.create({
        content,
        owner:req.user?._id,
        video:videoId
    })
    if(!comment)
        throw new ApiError(500,"Something occured while adding comment")
    return res.status(200)
    .json(
        new ApiResponse(200,comment,"Comment added successfully")
    )
    
})

//update comment
const updateComment= asyncHandler(async (req,res) => {

    //get the comment id and new content from the user
    const {commentId} =req.params
    const {content}=req.body

    if(!content)
        throw new ApiError(400,"Content field is empty")

    const comment= await Comment.findById(commentId)
    if(!comment)
        throw new ApiError(400,"Comment not found")

    if (comment.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorised access")

    comment.content=content
    await comment.save({ validateBeforeSave: false })

    return res.status(200)
    .json(
        new ApiResponse(200,comment,"Comment has been updated  successfully")
    )
})

//delete comment
const deleteComment= asyncHandler(async (req,res) => {
    const {commentId} =req.params
    const comment = await Comment.findById(commentId)
    if(!comment)
        throw new ApiError(404,"Comment not found")

    if(comment.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorized access")

    const deletedComment= await Comment.findByIdAndDelete(commentId)
    if(!deletedComment)
        throw new ApiError(500,"Error in deleting comment, Try again later ")

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Comment has been deleted successfully")
    )
})

//get video comments
const getVideoComments= asyncHandler(async (req,res) => {
    const {videoId} = req.params
    const {page=1, limit=10} =req.query

    const commentCacheKey= `video_comments:${videoId}:page:${page}:limit:${limit}`
    const commentCachevalue= await client.get(commentCacheKey)
    if(commentCachevalue)
        return res.status(200)
        .json(new ApiResponse(200, JSON.parse(commentCachevalue),"Comments fetched successfully from redis cache"))

    const video= Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            //getting the details of user
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
        },
        {
            $sort:{createdAt :-1}
        }
    ])
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    const comments= await Comment.aggregatePaginate(video,options)
    if(!comments)
        throw new ApiError(500,"Error in fetching comments")

    await client.setEx(commentCacheKey,1000,JSON.stringify(comments))
    return res.status(200)
    .json(
        new ApiResponse(200,comments,"Comments fetched successfully")
    )
})

export { addComment,updateComment, deleteComment,getVideoComments }