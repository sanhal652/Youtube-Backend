import { getVideoDetails } from '@/axiosFiles/videoApi'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCurrentVideo } from '@/store/videoSlice'
import { toggleLikeStatusApi } from '@/axiosFiles/likeApi'
import { toggleLikeStatusStore } from '@/store/likeSlice'
import { Button } from './ui/button'
import { toggleSubscriptionStatus } from '@/axiosFiles/subscriptionApi'
import { toggleSubscriptionStatusStore } from '@/store/subscriptionSlice'
import { ThumbsUp, Bell, BellOff } from 'lucide-react'

function VideoFile() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()

    const { videoId } = useParams()
    const { currentVideo } = useSelector(state => state.video)
    const { likedVideos } = useSelector(state => state.like)
    const { userSubscribedChannels } = useSelector(state => state.subscription)

    // 1. Unified Local States for Instant UI Interactions
    const [likes, setLikes] = useState(0)
    const [isActiveLiked, setIsActiveLiked] = useState(false) 
   
    const [isActiveSubscribed,setIsActiveSubscribed]= useState(false) 

    const isSubscribed = userSubscribedChannels.some(
        channel => channel._id === currentVideo?.owner?._id
    )

    // 2. Fetch Video Data on Mount or Route Param Shifts
    useEffect(() => {
        const getVideo = async () => {
            setError(null)
            setLoading(true)
            try {
                const response = await getVideoDetails(videoId)
                if (response.success) {
                    dispatch(fetchCurrentVideo(response.data))
                }
            } catch (error) {
                console.log("Error fetching video", error)
                setError("Failed to load video")
            } finally {
                setLoading(false)
            }
        }
        if (videoId) getVideo()
    }, [videoId, dispatch])

    // 3.  Handles populating state when network requests complete
    useEffect(() => {
        if (currentVideo) {
            setLikes(currentVideo.totalLikes);
            // Derive the initial button visual status from Redux list records safely
            setIsActiveLiked(likedVideos.some(v => v._id === videoId));
             
            const isCurrentlySubbed= userSubscribedChannels.some(
                item=>item.channel===currentVideo?.owner?._id)
           
            setIsActiveSubscribed(isCurrentlySubbed)
        }
    }, [currentVideo?.totalLikes, currentVideo?._id, likedVideos, videoId,currentVideo?.owner?._id, userSubscribedChannels]);

    // 4.  Toggling Function
    const handleLike = async () => {
        const wasLiked = isActiveLiked 
        try {
            const response = await toggleLikeStatusApi(videoId)
            if (response.success) {
              
                setLikes(prev => wasLiked ? prev - 1 : prev + 1)
                setIsActiveLiked(!wasLiked)
                
               
                dispatch(toggleLikeStatusStore({ videoId, video: currentVideo }))
            }
        } catch (error) {
            console.log("Like failed", error)
        }
    }

    const handleSubscribe = async () => {
        const wasSubscribed= isActiveSubscribed
        try {
            const response = await toggleSubscriptionStatus(currentVideo?.owner?._id)
            if (response.success) {
                setIsActiveSubscribed(!wasSubscribed),
                dispatch(toggleSubscriptionStatusStore({
                    channelId: currentVideo?.owner?._id
                }))
               
            }
        } catch (error) {
            console.log("Subscription failed", error)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-500 text-lg">{error}</p>
        </div>
    )

    
    if (!currentVideo) return null

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left — Video + Details */}
                <div className="flex-1">

                    {/* Video Player */}
                    <div className="w-full rounded-xl overflow-hidden bg-black aspect-video">
                        <video
                            src={currentVideo?.videoFile}
                            controls
                            className="w-full h-full"
                        />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mt-4">
                        {currentVideo?.title}
                    </h3>

                    {/* Views + Date */}
                    <p className="text-sm text-gray-500 mt-1">
                        {currentVideo?.views} views • {new Date(currentVideo?.createdAt).toDateString()}
                    </p>

                    <div className="flex flex-col mt-4 pb-4 border-b border-gray-200">

                        {/* Owner + Actions Row */}
                        <div className="flex flex-row items-center justify-between gap-4">

                            {/* Owner Info + Subscribe */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (currentVideo?.owner?.username) {
                                            navigate(`/channel/${currentVideo.owner.username}`);
                                        } else {
                                            console.warn("User data not loaded yet");
                                        }
                                    }}>
                                    <img
                                        src={currentVideo?.owner?.avatar}
                                        alt={currentVideo?.owner?.username}
                                        className="w-11 h-11 rounded-full object-cover"
                                        onError={(e) => e.target.src = "https://placehold.co/44x44?text=U"}
                                    />
                                </button>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {currentVideo?.owner?.username}
                                    </p>
                                </div>

                                <Button
                                    onClick={handleSubscribe}
                                    className={`ml-4 rounded-full px-5 py-2 text-sm font-semibold transition-all ${isActiveSubscribed
                                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                                        : "bg-red-600 hover:bg-red-700 text-white"
                                        }`}
                                >
                                    {isActiveSubscribed ? (
                                        <span className="flex items-center gap-1">
                                            <BellOff className="w-4 h-4" /> Subscribed
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <Bell className="w-4 h-4" /> Subscribe
                                        </span>
                                    )}
                                </Button>
                            </div>

                            {/* Like Button */}
                            <Button
                                onClick={handleLike}
                                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                                    isActiveLiked 
                                        ? "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
                                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                                }`}
                            >
                                <ThumbsUp className={`w-4 h-4 ${isActiveLiked ? "fill-red-600" : ""}`} />
                                {isActiveLiked ? "Liked" : "Like"}
                                <span className="ml-1 text-xs"> {likes} </span>
                            </Button>

                               { /*  Summary button*/}
                           
                        </div>

                        {/* Description */}
                        <div className="mt-3 bg-gray-50 rounded-xl p-4 self-start">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {currentVideo?.description}
                            </p>
                        </div>

                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {currentVideo?.totalComments} Comments
                        </h2>
                        <div className="space-y-4">
                            {currentVideo?.recentComments?.map(comment => (
                                <div key={comment._id} className="flex gap-3">
                                    <img
                                        src={comment.commentedBy?.avatar}
                                        alt={comment.commentedBy?.username}
                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                        onError={(e) => e.target.src = "https://placehold.co/32x32?text=U"}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {comment.commentedBy?.username}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-0.5">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoFile