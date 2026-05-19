import api from "./axios";

export const toggleLikeStatusApi = async(videoId)=>{
    const response= await api.post(`/likes/toggle-video/${videoId}`)
    return response.data
}

export const getLikedVideosApi= async()=>{
    const response = await api.get('/likes/liked-videos')
    return response.data
}