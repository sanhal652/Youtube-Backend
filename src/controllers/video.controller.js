import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { Videos } from "../models/videos.model.js";
import mongoose from "mongoose";

//upload video

const uploadVideo = asyncHandler(async (req, res) => {

    //get the title and description from user
    const { title, description } = req.body
    if (!title || !description)
        throw new ApiError(400, "Title or description is missing")

    //get the thumbnail and videofile and check it and upload
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if (!thumbnailLocalPath)
        throw new ApiError(404, "Thumbnail is required")

    const videoFileLocalPath = req.files?.videoFile[0]?.path
    if (!videoFileLocalPath)
        throw new ApiError(404, "Video file is required")

    const thumbnail = await uploadCloudinary(thumbnailLocalPath)
    if (!thumbnail.url)
        throw new ApiError(404, "Thumbnail upload failed")

    const videoFile = await uploadCloudinary(videoFileLocalPath)
    if (!videoFile.url)
        throw new ApiError(404, "Video File upload failed")

    //create a new database entry
    const videoDetails = await Videos.create({
        videoFile: videoFile?.url,
        thumbnail: thumbnail?.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id,
        isPublished: true
    })

    const createdVideo = await Videos.findById(videoDetails._id)
    if (!createdVideo)
        throw new ApiError(404, "Video is not found")
    return res.status(200)
        .json(
            new ApiResponse(200, createdVideo, "Video uploaded successfully")
        )

})

//delete video

const deleteVideo = asyncHandler(async (req, res) => {
    //get video id from url
    const { videoId } = req.params

    //check whether it exists in database
    const video = await Videos.findById(videoId)
    if (!video)
        throw new ApiError(404, "Video not found")

    //check whether the owner of the video matches with the actual owner
    if (video.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You do not have permission to delete the video")

    //delete from cloudinary
    const videoFilePublicId = video.videoFile.split("/").pop().split(".")[0];
    const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(videoFilePublicId, { resource_type: 'video' })
    await cloudinary.uploader.destroy(thumbnailPublicId)

    //delete from database
    const deletedVideo = await Videos.findByIdAndDelete(videoId)
    if (!deletedVideo)
        throw new ApiError(404, "Video not found or already deleted by the user")

    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Video has been deleted successfully")
        )

})


//update video

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailPath = req.files?.thumbnail?.[0]?.path

    if (!title && !description && !thumbnailPath) {
        throw new ApiError(400, "Provide at least one field to update")
    }

    const video = await Videos.findById(videoId)
    if (!video) 
        throw new ApiError(404, "Video does not exist")

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized access")
    }

    let newThumbnail = null
    if (thumbnailPath) {
        newThumbnail = await uploadCloudinary(thumbnailPath)
        
        if (!newThumbnail?.url) {
            throw new ApiError(500, "Error while uploading to Cloudinary")
        }

        const oldThumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(oldThumbnailPublicId);
    }

    const updatedVideo = await Videos.findByIdAndUpdate(
        videoId, 
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: newThumbnail?.url || video.thumbnail
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})

//get video by id

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId} =req.params
    if(!videoId?.trim())
        throw new ApiError(400,"Video not found")

    //to increment the view count
    await Videos.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    });
    const video= await Videos.aggregate([
        {
            $match:{
               _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            //getting like count
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likesCount",
            }
        },
        {
            //getting comments count
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"commentsCount",  
            }
        },
        {
            //getting recent comments
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"recentComments",
                pipeline:[{
                      $sort:{ createdAt:-1}
                    },
                    {
                        $limit:10
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"commentedBy",
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
                           commentedBy:{
                            $first:"$commentedBy"
                           }
                        }
                    }
                ]
            }
        },
        {
            //getting owner
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
                totalLikes:{
                    $size:"$likesCount"
                },
                totalComments:{
                    $size:"$commentsCount"
                },
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $project:{
                totalLikes:1,
                totalComments:1,
                views:1,
                title:1,
                thumbnail:1,
                owner:1,
                recentComments:1,
                videoFile:1,
                description:1
            }
        }
    ])  
    if(!video?.length)
        throw new ApiError(500,"Unable to fetch video")
    return res.status(200)
    .json(
        new ApiResponse(200,video[0],"Video fetched successfully")
    )
})


//get all videos for home page or feed

const getAllVideos = asyncHandler(async (req, res) => {  
    //if the user does not send anything then the default values will be taken and in page 1 
    // 10 videos will be shown
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    //  Initialize the Pipeline array
    const pipeline = [];

    //Filter by query (Title or Description)
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    //regex: for partial matching
                    //options:i - for making case insensitive
                    { title: { $regex: query, $options: "i" } },  
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // If looking for a specific creator's videos
    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

    // Only show published videos to the public
    pipeline.push({
        $match: {
            isPublished: true
        }
    });

    // Handle how the videos are ordered
    if (sortBy && sortType) {
        const sortDirection = sortType === "asc" ? 1 : -1;
        pipeline.push({
            $sort: {
                [sortBy]: sortDirection
            }
        });
    } else {
        // Default: Show newest videos first
        pipeline.push({
            $sort: {
                createdAt: -1
            }
        });
    }

    // Fetch uploader details (Join with User collection)
    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    );

    //  PAGINATION: Prepare options for the plugin
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        customLabels: {
            totalDocs: "totalVideos",
            docs: "videos"
        }
    };

    const result = await Videos.aggregatePaginate(
        Videos.aggregate(pipeline),
        options
    );

    if (!result) {
        throw new ApiError(500, "Error while fetching videos");
    }

    return res.status(200).json(
        new ApiResponse(200, result, "Videos fetched successfully")
    );
});

//toggle public status

const togglePublicStatus= asyncHandler(async (req,res) => {
    const {videoId}=req.params
    const video = await Videos.findById(videoId)
    if(!video)
        throw new ApiError(404,"Video not found")
    if(video.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorized request")
    video.isPublished= !video.isPublished
    await video.save({validateBeforeSave:false})

    return res.status(200)
    .json(
        new ApiResponse(200,video,"Publish status updated successsfully")
    )
    
})

export { uploadVideo, deleteVideo, updateVideo, getVideoById, getAllVideos,togglePublicStatus }