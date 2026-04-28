import { createSlice } from "@reduxjs/toolkit";

const initialState={
    allVideos:[],
    userVideos:[],
    currentVideo:null,
    loading:false,
    error:null
}

const videoSlice=createSlice({
    name:"video",
    initialState,
    reducers:{
        fetchAllVideos:(state,action)=>{
            state.allVideos= action.payload;
            state.loading=false;
        },
        fetchCurrentVideo:(state,action)=>{
            state.currentVideo=action.payload;
            state.loading=false;
        },
        addVideo:(state,action)=>{
            state.userVideos.unshift(action.payload);
            state.allVideos.unshift(action.payload);
        },
        deleteVideo:(state,action)=>{
            state.allVideos=state.allVideos.filter(video=>video._id!==action.payload);
            state.userVideos=state.userVideos.filter(video=>video._id!==action.payload);
        },
        setLoading:(state)=>{
            state.loading=true;
        }
    }
})


export default videoSlice.reducer;
export const {fetchAllVideos,fetchCurrentVideo,addVideo,deleteVideo,setLoading}=videoSlice.actions;