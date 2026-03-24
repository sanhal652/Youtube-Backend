import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose"

//create playlist
const createPlaylist= asyncHandler(async (req,res) => {
    const {name,description} = req.body
    if(!name || !description)
        throw new ApiError(400,"Name or description is required")
    const playlist= await Playlist.create({
        name:name.trim(),
        description,
        owner:req.user?._id
    })
    if(!playlist)
        throw new ApiError(500,"Error in creating playlist")
    return res.status(201)
    .json(
        new ApiResponse(201,playlist,"Playlist created successfully")
    )
})

//update playlist
const updatePlaylist= asyncHandler(async (req,res) => {
    const {playlistId}= req.params
    const {name,description} = req.body
    if(!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404,"Wrong format")
    if(!name && !description)
        throw new ApiError(400,"Name or description is required")
    const playlist= await Playlist.findById(playlistId)
    if(!playlist)
        throw new ApiError(404,"Playlist not found")
    if(playlist.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorized access, unable to update playlist")
    
    const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name:name || playlist.name,
            description: description || playlist.description
        }
    },
{
    new:true
})
    if(!updatedPlaylist)
        throw new ApiError(500,"Error in updating playlist")
    return res.status(200)
    .json(
        new ApiResponse(200,updatedPlaylist,"Playlist updated successfully")
    )
})

//delete playList
const deletePlaylist= asyncHandler(async (req,res) => {
     const {playlistId}= req.params
     if(!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404,"Wrong format")

     const playlist= await Playlist.findById(playlistId)
    if(!playlist)
        throw new ApiError(404,"Playlist not found")
    if(playlist.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"Unauthorized access, unable to delete playlist")
    
    const deletedPlaylist= await playlist.deleteOne()
    if(!deletedPlaylist)
        throw new ApiError(500,"Error in deleting playlist")
    return res.status(200)
    .json(
        new ApiResponse(200,{},"Playlist deleted successfully")
    )
})
export { createPlaylist,updatePlaylist,deletePlaylist }