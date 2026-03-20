import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { Videos } from "../models/videos.model.js";

//upload video

const uploadVideo=asyncHandler(async (req,res) => {

    //get the title and description from user
    const {title , description}= req.body
    if(!title || !description)
        throw new ApiError(400,"Title or description is missing")

    //get the thumbnail and videofile and check it and upload
    const thumbnailLocalPath= req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath)
        throw new ApiError(404,"Thumbnail is required")

     const videoFileLocalPath= req.files?.videoFile[0]?.path
    if(!videoFileLocalPath)
        throw new ApiError(404,"Video file is required")

    const thumbnail= await uploadCloudinary(thumbnailLocalPath)
    if(!thumbnail.url)
        throw new ApiError(404,"Thumbnail upload failed")

    const videoFile= await uploadCloudinary(videoFileLocalPath)
    if(!videoFile.url)
        throw new ApiError(404,"Video File upload failed")

    //create a new database entry
    const videoDetails= await Videos.create({
        videoFile: videoFile?.url,
        thumbnail:thumbnail?.url,
        title,
        description,
        duration:videoFile.duration,
        owner:req.user?._id,
        isPublished:true
    })

    const createdVideo= await Videos.findById(videoDetails._id)
    if(!createdVideo)
        throw new ApiError(404,"Video is not found")
    return res.status(200)
    .json(
        new ApiResponse(200,createdVideo,"Video uploaded successfully")
    )

})

//delete video

const deleteVideo= asyncHandler(async (req,res) => {
    //get video id from url
    const {videoId}= req.params
    
    //check whether it exists in database
    const video= await Videos.findById(videoId)
    if(!video)
        throw new ApiError(404,"Video not found")

    //check whether the owner of the video matches with the actual owner
    if(video.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"You do not have permission to delete the video")

    //delete from cloudinary
    const videoFilePublicId = video.videoFile.split("/").pop().split(".")[0];
    const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(videoFilePublicId,{resource_type:'video'})
    await cloudinary.uploader.destroy(thumbnailPublicId)

    //delete from database
   const deletedVideo= await Videos.findByIdAndDelete(videoId)
   if(!deletedVideo)
    throw new ApiError(404,"Video not found or already deleted by the user")
   
    return res.status(200)
    .json(
        new ApiResponse(200,{},"Video has been deleted successfully")
    )
    
})

//get like count of videos

// const getLikeCount= asyncHandler(async (req,res) => {
    
// })

export  {uploadVideo,deleteVideo}