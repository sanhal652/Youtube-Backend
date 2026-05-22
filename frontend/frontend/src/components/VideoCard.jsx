import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, ListPlus, Share2, Clock, Check } from 'lucide-react' // Added standard utility icons

function VideoCard({ video, onAddToPlaylist }) {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)
    const [copied, setCopied] = useState(false)

    // Handle copying the video link to the clipboard
    const handleShare = (e) => {
        e.stopPropagation(); 

        // Generates an absolute URL 
        const videoUrl = `${window.location.origin}/video/${video._id}`;
        
        navigator.clipboard.writeText(videoUrl)
            .then(() => {
                setCopied(true);
               
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error("Failed to copy link:", err));
        
        setShowMenu(false); 
    };

    
    const handleWatchLater = (e) => {
        e.stopPropagation();
        alert("Added to Watch Later!"); 
        setShowMenu(false);
    };

    return (
        <div
            onClick={() => navigate(`/video/${video._id}`)}
            className="cursor-pointer group w-full relative"
        >
            {/* Thumbnail */}
            <div
                className="relative w-full rounded-xl overflow-hidden bg-gray-200"
                style={{ paddingTop: '56.25%' }}
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => e.target.src = "https://placehold.co/640x360?text=No+Thumbnail"}
                />
                {video.duration ? (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                    </span>
                ) : null}
            </div>

            {/* Owner + Details */}
            <div className="flex gap-3 mt-3 relative">
                <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    style={{ width: '36px', height: '36px', minWidth: '36px' }}
                    className="rounded-full object-cover mt-0.5"
                    onError={(e) => e.target.src = "https://placehold.co/36x36?text=U"}
                />

                <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 hover:text-gray-700 transition-colors">
                        {video.owner?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {video.views >= 1000
                            ? `${(video.views / 1000).toFixed(1)}K`
                            : video.views} views • {new Date(video.createdAt).toDateString()}
                    </p>
                </div>

                {/* 🟢 THE 3-DOTS BUTTON CONTAINER (Only shows up on card hover) */}
                <div className="absolute right-0 top-0 invisible group-hover:visible">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 rounded-full bg-white/95 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors shadow-xs"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* THE DROPDOWN MENU PANEL */}
                    {showMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    setShowMenu(false);
                                }} 
                            />
                            
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-20">
                                
                                {/* Option 1: Save to Playlist */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        setShowMenu(false);
                                        onAddToPlaylist(video._id); // Triggers parent Homefeed modal overlay
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <ListPlus className="w-4 h-4 text-gray-400" /> Save to playlist
                                </button>

                                {/* Option 2: Share (Copy Link) */}
                                <button
                                    onClick={handleShare}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Share2 className="w-4 h-4 text-gray-400" /> Share video
                                </button>

                                {/* Option 3: Recommended - Watch Later */}
                                <button
                                    onClick={handleWatchLater}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                                >
                                    <Clock className="w-4 h-4 text-gray-400" /> Watch Later
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {copied && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-30 transition-all animate-in fade-in slide-in-from-top-1">
                    <Check className="w-3.5 h-3.5 text-green-400" /> Link copied to clipboard!
                </div>
            )}
        </div>
    )
}

export default VideoCard