import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserChannelProfile, getCurrentUser } from '@/axiosFiles/userApi';
import { getChannelStats, getChannelVideos } from '@/axiosFiles/dashboardApi';
import VideoCard from './VideoCard';
import { Button } from "@/components/ui/button"; // Assuming you have this Shadcn button
import { useSelector } from 'react-redux';
import { toggleSubscriptionStatus } from '@/axiosFiles/subscriptionApi';
import { toggleSubscriptionStatusStore } from '@/store/subscriptionSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

function Channel() {
    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const { userData } = useSelector(state => state.auth)
    const dispatch= useDispatch()
    const navigate= useNavigate()

    useEffect(() => {
        const fetchChannelDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch Profile
                const userProfile = await getUserChannelProfile(username);
                if (userProfile?.data) {
                    const data = userProfile.data;
                    setProfile(data);

                    // 2. Fetch Stats & Videos in parallel
                    const [statsRes, videosRes] = await Promise.all([
                        getChannelStats(data._id),
                        getChannelVideos(data._id)
                    ]);

                    setStats(statsRes?.data);
                    setVideos(videosRes?.data || []);
                }
            } catch (err) {
                console.error("Error fetching channel:", err);
                setError("Failed to load channel details.");
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchChannelDetails();
    }, [username]);



    if (loading) return <div className="text-center mt-10">Loading channel...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!profile) return null;

    const handleSubscribe= async()=>{
        try {
            await toggleSubscriptionStatus(profile._id)
            setProfile(prev => ({
            ...prev,
            isSubscribed: !prev.isSubscribed
        }))
            dispatch(toggleSubscriptionStatusStore(profile._id))
        } catch (error) {
            console.log("Error is subscribing",error)
        }
    }

    return (
        <div className="w-full">
            {/* 1. Channel Banner/Header (Cover Image) */}
            <div className="w-full h-48 sm:h-60 bg-gray-200 overflow-hidden">
                <img
                    src={profile.coverImage || "https://placehold.co/1200x300?text=No+Cover"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://placehold.co/1200x300?text=No+Cover"}
                />
            </div>

            {/* 2. Container for Profile Info & Videos */}
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* 3. The Overlapping Profile Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-10 z-10 relative">

                    {/* Left: Avatar + Names */}
                    <div className="flex items-center gap-5 sm:gap-6">
                        {/* THE DP IN A CIRCLE (Negative Margin creates the overlap) */}
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                            <img
                                src={profile.avatar || "https://placehold.co/160x160?text=U"}
                                alt={profile.username}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = "https://placehold.co/160x160?text=U"}
                            />
                        </div>

                        <div className="pt-16 sm:pt-0"> {/* Pushes text down on mobile when overlapping */}
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                                {profile.fullName}
                            </h1>
                            <p className="text-base text-gray-600 mt-1">@{profile.username}</p>

                            {/* Simple Stats Inline */}
                            <div className="flex gap-4 mt-3 text-sm font-medium text-gray-700">
                                <span>{stats?.totalSubscribers || 0} subscribers</span>
                                <span>{stats?.totalVideos || 0} videos</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Action Button (Me vs. Other check goes here) */}

                    <div className="flex gap-3 sm:pb-3">
                        {/* check whether same user or not*/}
                        {userData?._id === profile?._id ? (<Button onClick={()=>navigate('/edit-channel')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-full px-6 border border-gray-300 ">
                            ✏️ Edit Channel
                        </Button>) : (
                            profile.isSubscribed ? (
                                <Button
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-full px-6 border border-gray-300 flex items-center gap-2"
                                    onClick={handleSubscribe}
                                >
                                    ✅ Subscribed
                                </Button>
                            ) : (
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-6 flex items-center gap-2"
                                    onClick={handleSubscribe}
                                >
                                    🔔 Subscribe
                                </Button>
                            )
                        )}
                    </div>
                </div>

                {/* 4. Video Grid Section */}
                <div className="border-t border-gray-200 pt-10">
                    <h2 className="text-2xl font-bold text-gray-950 mb-8">Videos</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                        {videos.length > 0 ? (
                            videos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">This channel hasn't uploaded any videos yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Channel;