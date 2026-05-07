import api from "axios";

export const toggleSubscriptionStatus= async(channelId)=>{
    const response= await api.post(`/subscription/toggle-sub/${channelId}`)
    return response.data
}