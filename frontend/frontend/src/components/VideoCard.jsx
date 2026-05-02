import React from 'react'
import { useNavigate } from 'react-router-dom'

function VideoCard({ video }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/video/${video._id}`)}
            className="cursor-pointer group w-full"
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Duration badge - optional */}
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </span>
            </div>

            {/* Owner + Details */}
            <div className="flex gap-3 mt-3">
                {/* Owner Avatar */}
                <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                />

                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                        {video.title}
                    </h3>

                    {/* Channel Name */}
                    <p className="text-xs text-gray-500 mt-1 hover:text-gray-700 transition-colors">
                        {video.owner?.username}
                    </p>

                    {/* Views and Date */}
                    <p className="text-xs text-gray-500 mt-0.5">
                        {video.views >= 1000
                            ? `${(video.views / 1000).toFixed(1)}K`
                            : video.views} views • {new Date(video.createdAt).toDateString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
