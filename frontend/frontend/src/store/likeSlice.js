import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    likedVideos: [],
    loading: false
}

const likeSlice = createSlice({
    name: "like",
    initialState,
    reducers: {
        getLikedVideosStore: (state, action) => {
            state.likedVideos = action.payload;
        },
        toggleLikeStatusStore: (state, action) => {
            const { videoId } = action.payload;
            if (state.currentVideo && state.currentVideo._id === videoId) {
                if (state.isLiked) { 
                    state.currentVideo.totalLikes -= 1;
                } else {
                    state.currentVideo.totalLikes += 1;
                }
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export default likeSlice.reducer;
export const { getLikedVideosStore, toggleLikeStatusStore, setLoading } = likeSlice.actions;