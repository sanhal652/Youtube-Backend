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
        getUserSubscribersStore:(state,action)=>{   //how many people subscribed to my channel
            state.userSubscribers=action.payload;
        },
        getUserSubscribedChannelsStore:(state,action)=>{      //how many channel i subscribed
            state.userSubscribedChannels=action.payload;
        },
        toggleSubscriptionStatusStore:(state,action)=>{
            const {channelId}= action.payload;
            const isSubscribed=state.userSubscribedChannels.find(item=>item.channel===channelId)
            if(isSubscribed){
                state.userSubscribedChannels=state.userSubscribedChannels.filter(item=>item.channel!==channelId)
            } else {
                state.userSubscribedChannels.push({channel: channelId})
            }
        }
    }
})

export default subscriptionSlice.reducer;
export const { getUserSubscribersStore, getUserSubscribedChannelsStore,toggleSubscriptionStatusStore }= subscriptionSlice.actions;