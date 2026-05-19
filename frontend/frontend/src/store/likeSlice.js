import {createSlice} from "@reduxjs/toolkit";

const initialState={
    likedVideos:[],
    loading:false
}

const likeSlice= createSlice({
    name: "like",
    initialState,
    reducers:{
        getLikedVideosStore:(state,action)=>{
            state.likedVideos=action.payload;
        },
        toggleLikeStatusStore:(state,action)=>{
            const {videoId,video}=action.payload;
            const isLiked= state.likedVideos.find(v=>v._id===videoId)
            if(isLiked){
                state.likedVideos=state.likedVideos.filter(v=>v._id!==videoId)
            }else{
                state.likedVideos.push(video)
            }
        },
        setLoading:(state,action)=>{
            state.loading=action.payload;
        }
    }
})

export default likeSlice.reducer;
export const{ getLikedVideosStore,toggleLikeStatusStore,setLoading }= likeSlice.actions;