import api from "./axios";

export const toggleSubscriptionStatus= async(channelId)=>{
    const response= await api.post(`/subscription/toggle-sub/${channelId}`)
    return response.data
}

export const getUserChannelSubscribers= async(channelId)=>{
    const response= await api.get(`/subscription/subscribers/${channelId}`)
    return response.data
}

export const getSubscribedChannels=async()=>{
    const response = await api.get('/subscription/my-subscription')
    return response.data
}