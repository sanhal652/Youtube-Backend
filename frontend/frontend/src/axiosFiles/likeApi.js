import api from "./axios";

export const toggleLikeStatusApi = async(videoId)=>{
    const response= await api.post(`/likes/toggle-video/${videoId}`)
    return response.data
}