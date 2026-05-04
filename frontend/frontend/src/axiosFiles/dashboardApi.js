import api from "./axios";

const getChannelStats = async(channelId)=>{
    const response = await api.get(`/dashboard/channel/${channelId}`)
    return response.data;
}

const getChannelVideos= async(channelId)=>{
    const response = await api.get(`/dashboard/videos/${channelId}`)
    return response.data;
}

export {getChannelStats,getChannelVideos}