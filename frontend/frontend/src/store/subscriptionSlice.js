import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userSubscribedChannels:[],
    userSubscribers:[],
    loading:false,
    error:null
}

const subscriptionSlice= createSlice({
    name:"subscription",
    initialState,
    reducers:{
        getUserSubscribers:(state,action)=>{   //how many people subscribed to my channel
            state.userSubscribers=action.payload;
        },
        getUserSubscribedChannels:(state,action)=>{      //how many channel i subscribed
            state.userSubscribedChannels=action.payload;
        },
        toggleSubscriptionStatusStore:(state,action)=>{
            const {channelId}= action.payload;
            const isSubscribed=state.userSubscribedChannels.find(channel=>channel._id===channelId)
            if(isSubscribed){
                state.userSubscribedChannels=state.userSubscribedChannels.filter(channel=>channel._id!==channelId)
            } else {
                state.userSubscribedChannels.push(action.payload)
            }
        }
    }
})

export default subscriptionSlice.reducer;
export const { getUserSubscribers, getUserSubscribedChannels,toggleSubscriptionStatusStore }= subscriptionSlice.actions;