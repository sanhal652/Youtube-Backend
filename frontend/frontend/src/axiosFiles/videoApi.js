import api from "./axios";

const uploadVideo= async(formData)=>{
    const response= await api.post("/video/upload",formData)
    return response.data;
}

const deleteVideo= async(videoId)=>{
    const response= await api.delete(`/video/delete/${videoId}`)
    return response.data;
}
const updateVideo= async(videoId,formData)=>{
    const response= await api.patch(`/video/update/${videoId}`,formData)
    return response.data;
}

const getVideoDetails= async(videoId)=>{
    const response= await api.get(`/video/video/${videoId}`)
    return response.data;
}

const getAllVideos= async()=>{
    const response= await api.get("/video/all-videos")
    return response.data;
}

const toggleUploadStatus= async(videoId)=>{
    const response= await api.patch(`/video/toggle/${videoId}`)
    return response.data;
}

const getVideoSummary= async(videoId)=>{
    const response= await api.get(`/video/summary/${videoId}`)
    return response.data;
}

export {uploadVideo,deleteVideo,updateVideo,getVideoDetails,getAllVideos,toggleUploadStatus,getVideoSummary}