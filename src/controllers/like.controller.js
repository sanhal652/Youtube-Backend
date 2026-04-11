import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Likes } from "../models/likes.model.js"
import { Videos } from "../models/videos.model.js"
import { Tweet } from "../models/tweets.model.js"
import { Comment } from "../models/comments.model.js"
import { client } from "../db/redis.js"

//toggle like status in video and send notification to video owner using web sockets
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId))
        throw new ApiError(400, "Invalid video ID")
    const alreadyLiked = await Likes.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if (alreadyLiked) {
        const removeLike = await Likes.findByIdAndDelete(alreadyLiked._id)
        if (!removeLike)
            throw new ApiError(500, "Error in removing like")
        return res.status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
            )
    }
    else {
        const addLike = await Likes.create({
            video: videoId,
            likedBy: req.user?._id
        })
        if (!addLike)
            throw new ApiError(500, "Error in liking the video")

        //including web sockets to notify the video owner about the new like

        const videoOwner = await Videos.findById(videoId).select("owner")
        const io = req.app.get("io")
        const userSocketMap = req.app.get("userSocketMap")

        if (videoOwner && videoOwner.owner) {
            const videoOwnerId = videoOwner.owner.toString()
            const receiverSocketId = userSocketMap[videoOwnerId]

            //increment the unread notification count for the video owner in redis cache
            if (req.user?._id !== videoOwnerId)   //ensires we don't send a notificattion when the owner likes its own video
                await client.hIncrBy("notification:unread", videoOwnerId, 1)

            const currentUnreadCount = await client.hGet("notification:unread", videoOwnerId)

            //emit data if owner is online
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("notification", {
                    message: `You have unread likes`,
                    from: {
                        _id: req.user?._id,
                        username: req.user?.username
                    },
                    videoId: videoId,
                    unreadCount: currentUnreadCount   //in frontend it can be easily to display no.of notifications beside bell icon
                })
            }
        }

        return res.status(200)
            .json(
                new ApiResponse(200, { ...addLike._doc, isLiked: true }, "Video liked successfully")
            )
    }
})

//toggle likes on tweet with web socket notification to tweet owner
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!mongoose.isValidObjectId(tweetId))
        throw new ApiError(400, "Invalid tweet ID")
    const alreadyLiked = await Likes.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (alreadyLiked) {
        const removeLike = await Likes.findByIdAndDelete(alreadyLiked._id)
        if (!removeLike)
            throw new ApiError(500, "Error in removing like")
        return res.status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
            )
    }
    else {
        const addLike = await Likes.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
        if (!addLike)
            throw new ApiError(500, "Error in liking the tweet")

        const tweetOwner = await Tweet.findById(tweetId).select("owner")
        const io = req.app.get("io")
        const userSocketMap = req.app.get("userSocketMap")
        if (tweetOwner && tweetOwner.owner) {
            const tweetOwnerId = tweetOwner.owner.toString()
            const receiverSocketId = userSocketMap[tweetOwnerId]

            if (req.user?._id !== tweetOwnerId)
                await client.hIncrBy("notification:unread", tweetOwnerId, 1)

            const currentTweetUnreadCount = await client.hGet("notification:unread", tweetOwnerId)

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("notification", {
                    message: "Somebody liked your tweet",
                    from: {
                        _id: req.user?._id,
                        username: req.user?.username
                    },
                    tweet: tweetId,
                    unreadCount: currentTweetUnreadCount
                })
            }
        }
        return res.status(200)
            .json(
                new ApiResponse(200, { ...addLike._doc, isLiked: true }, "Tweet liked successfully")
            )
    }
})

//toggle likes on comment with web socket notification to comment owner
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!mongoose.isValidObjectId(commentId))
        throw new ApiError(400, "Invalid comment ID")
    const alreadyLiked = await Likes.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if (alreadyLiked) {
        const removeLike = await Likes.findByIdAndDelete(alreadyLiked._id)
        if (!removeLike)
            throw new ApiError(500, "Error in removing like from comment")
        return res.status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Comment unliked successfully")
            )
    }
    else {
        const addLike = await Likes.create({
            comment: commentId,
            likedBy: req.user?._id
        })
        if (!addLike)
            throw new ApiError(500, "Error in liking the comment")

        const commentOwner = await Comment.findById(commentId).select("owner")

        const io = req.app.get("io")
        const userSocketMap = req.app.get("userSocketMap")

        if (commentOwner && commentOwner.owner) {
            const commentOwnerId = commentOwner.owner.toString()
            const receiverSocketId = userSocketMap[commentOwnerId]

            if (req.user?._id !== commentOwnerId)
                await client.hIncrBy("notification:unread", commentOwnerId, 1)

            const commentUnreadCount = await client.hGet("notification:unread", commentOwnerId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("notification", {
                    message: "Somebody liked your comment",
                    from: {
                        _id: req.user?._id,
                        username: req.user?.username
                    },
                    comment: commentId,
                    unreadCount: commentUnreadCount
                })
            }
        }
        return res.status(200)
            .json(
                new ApiResponse(200, { ...addLike._doc, isLiked: true }, "Comment liked successfully")
            )
    }

})

// get liked videos

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const allVideos = await Likes.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
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
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        },
        {
            // This makes the 'video' object the root of the result
            $replaceRoot: { newRoot: "$video" }

        }
    ])
    if (!allVideos)
        throw new ApiError(500, "Error in fetching  liked videos")
    return res.status(200)
        .json(
            new ApiResponse(200, allVideos, " Liked Videos fetched successfully")
        )


})

export { toggleVideoLike, toggleTweetLike, toggleCommentLike, getLikedVideos }