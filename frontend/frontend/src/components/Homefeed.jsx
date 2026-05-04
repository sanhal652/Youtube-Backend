import { getAllVideos } from '@/axiosFiles/videoApi'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllVideos, setLoading } from '../store/videoSlice'
import VideoCard from './VideoCard'

function Homefeed() {
    const dispatch = useDispatch()
    const { allVideos, loading } = useSelector(state => state.video)
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                dispatch(setLoading(true))
                const response = await getAllVideos()
                if (response.success) {
                    dispatch(fetchAllVideos(response.data.videos))
                }
            } catch (error) {
                console.error('Error fetching videos:', error)
            } finally {
                dispatch(setLoading(false))
            }
        }
        fetchVideos()
    }, [dispatch])

    // Loading state
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {/* Skeleton loader */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="w-full aspect-video bg-gray-200 rounded-xl" />
                        <div className="flex gap-3 mt-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Empty state
    if (!loading && allVideos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-xl font-semibold text-gray-700">No videos yet</h2>
                <p className="text-gray-500 mt-2">Be the first to upload a video!</p>
            </div>
        )
    }

    // Videos grid
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {allVideos.map(video =>
               video && <VideoCard key={video._id} video={video} />
            )}
        </div>
    )
}

export default Homefeed