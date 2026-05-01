import api from "./axios";

export const userSignup= async (formData)=>{
    const response= await api.post("/user/register",formData)
    return response.data;
}

export const userLogin=async (data)=>{
    const response= await api.post("/user/login",data)
    return response.data;
}

export const userLogout= async()=>{
    const response= await api.post("/user/logout")
    return response.data;
}

export const refreshAccessToken= async()=>{
    const response= await api.post("/user/refresh-token")
    return response.data;
}
export const getCurrentUser= async()=>{
    const response= await api.get("/user/current-user")
    return response.data;
}

export const changeCurrentPassword= async(data)=>{
    const response= await api.post("/user/change-password",data)
    return response.data;
}

export const updateAccountDetails= async(data)=>{
    const response= await api.patch("/user/update-account",data)
    return response.data;
}

export const updateAvatar= async(formData)=>{
    const response= await api.patch("/user/update-avatar",formData)
    return response.data;
}

export const updateCoverImg= async(formData)=>{
    const response= await api.patch("/user/update-coverImage",formData)
    return response.data;
}

export const getUserChannelProfile= async(username)=>{
    const response= await api.get(`/user/c/${username}`)
    return response.data;
}

export const getWatchHistory= async()=>{
    const response= await api.get("/user/watchHistory")
    return response.data;
}