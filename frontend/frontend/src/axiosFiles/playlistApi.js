import api from "./axios";

export const createPlaylistApi= async({name,description})=>{
    const response= await api.post("/playlist/create-playlist", {name,description})
    return response.data;
}

export const updatePlaylistApi= async({playlistId,name,description})=>{
    const response= await api.patch(`/playlist/update-playlist/${playlistId}`, {name,description})
    return response.data;
}

export const deletePlaylistApi= async(playlistId)=>{
    const response= await api.delete(`/playlist/delete-playlist/${playlistId}`)
    return response.data;
}

export const addVideoToPlaylistApi= async({playlistId,videoId})=>{
    const response= await api.post(`/playlist/add-video/${playlistId}/${videoId}`)
    return response.data;
}

export const deleteVideoFromPlaylistApi= async({playlistId,videoId})=>{
    const response= await api.delete(`/playlist/delete-video/${playlistId}/${videoId}`)
    return response.data;
}

export const getUserPlaylistsApi= async(userId)=>{
    const response= await api.get(`/playlist/userPlaylist/${userId}`)
    return response.data;
}

export const getPlaylistByIdApi= async(playlistId)=>{
    const response= await api.get(`/playlist/playlist/${playlistId}`)
    return response.data;
}