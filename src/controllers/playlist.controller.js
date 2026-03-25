import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose"
import { Videos } from "../models/videos.model.js";

//create playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name || !description)
        throw new ApiError(400, "Name and description is required")
    const playlist = await Playlist.create({
        name: name.trim(),
        description,
        owner: req.user?._id
    })
    if (!playlist)
        throw new ApiError(500, "Error in creating playlist")
    return res.status(201)
        .json(
            new ApiResponse(201, playlist, "Playlist created successfully")
        )
})

//update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    if (!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404, "Wrong format")
    if (!name && !description)
        throw new ApiError(400, "Name or description is required")
    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(404, "Playlist not found")
    if (playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "Unauthorized access, unable to update playlist")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name: name || playlist.name,
            description: description || playlist.description
        }
    },
        {
            new: true
        })
    if (!updatedPlaylist)
        throw new ApiError(500, "Error in updating playlist")
    return res.status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
        )
})

//delete playList
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404, "Wrong format")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(404, "Playlist not found")
    if (playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "Unauthorized access, unable to delete playlist")

    const deletedPlaylist = await playlist.deleteOne()
    if (!deletedPlaylist)
        throw new ApiError(500, "Error in deleting playlist")
    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )
})

//add video to playlist

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404, "Wrong format")

    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId))
        throw new ApiError(404, "Wrong format")

    const video = await Videos.findById(videoId)
    if (!video)
        throw new ApiError(404, "Video does not exist")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(404, "Playlist does not found, Create a new one")

    if (playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "Unauthorized access, unable to add video to playlist")

    const addedVideo = await Playlist.findByIdAndUpdate(playlistId, {
        $addToSet: {       // it is used to add videos without any chnages to the existingvideos in the array and 
            // also ensures no duplicates
            videos: videoId
        }
    }, {
        new: true
    })

    if (!addedVideo)
        throw new ApiError(500, "Error in adding video to playlist")

    return res.status(200)
        .json(
            new ApiResponse(200, addedVideo, "Video added successfully")
        )

})

//delete video from playlist
const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404, "Wrong format")

    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId))
        throw new ApiError(404, "Wrong format")

    const video = await Videos.findById(videoId)
    if (!video)
        throw new ApiError(404, "Video does not exist")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(404, "Playlist does not found, Create a new one")

    if (playlist.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "Unauthorized access, unable to delete video from playlist")

    const deletedVideo = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: {
            videos: videoId
        }
    }, {
        new: true
    })

    if (!deletedVideo)
        throw new ApiError(500, "Error in deleting video from playlist")

    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Video removed successfully")
        )
})

//get user playlist

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId))
        throw new ApiError(404, "Wrong format")

    const userPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "userPlaylist"
            }
        }, {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
                owner: {
                    username: { $arrayElemAt: ["$userPlaylist.username", 0] },
                    avatar: { $arrayElemAt: ["$userPlaylist.avatar", 0] }
                }
            }
        }
    ])

    if (!userPlaylists || userPlaylists.length === 0)
        throw new ApiError(404, "There is  no playlist")

    return res.status(200)
        .json(
            new ApiResponse(200, userPlaylists, "Playlist fetched successfully")
        )
})


//get playlist by id

const getPlayListById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.isValidObjectId(playlistId))
        throw new ApiError(404, "Wrong format")
    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            //finding videos in playlist
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videosInPlaylist",
                pipeline: [   // to get the owner of each videos
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "videoOwner",
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
                            videoOwner:
                                { $first: "$videoOwner" }
                        }
                    },
                ]
            }
        },
        {
            //to get the owner of playlist
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "playlistOwner",
                pipeline: [{
                    $project: {
                        username: 1,
                        avatar: 1
                    }
                }]
            }
        },
        {
            $addFields: {
                playlistOwner: {
                    $first: "$playlistOwner"
                }
            }
        }
    ])

    if (!playlist.length)
        throw new ApiError(404, "Unable to fetch playlist")

    return res.status(200)
        .json(
            new ApiResponse(200, playlist[0], "Playlist fetched successfully")
        )
})


export { createPlaylist, updatePlaylist, deletePlaylist, addVideoToPlaylist, deleteVideoFromPlaylist, getUserPlaylists, getPlayListById }