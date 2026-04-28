import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userPlaylists: [],
    currentPlaylist: null,
    loading: false,
    error: null
}

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        fetchUserPlaylists: (state, action) => {
            state.userPlaylists = action.payload;
        
        },


        fetchCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
            
        },


        addVideoToPlaylist: (state, action) => {
            const { playlistId, videoId } = action.payload;
            const playlist = state.userPlaylists.find(pl => pl._id === playlistId);
            if (playlist) {
                if (!playlist.videos.includes(videoId)) {  //prevent duplicates
                    playlist.videos.push(videoId); 
                }
            }
            
        },


        deleteVideoFromPlaylist: (state, action) => {
            const { playlistId, videoId } = action.payload;
            const playlist = state.userPlaylists.find(pl => pl._id === playlistId);
            if (playlist) {
                playlist.videos = playlist.videos.filter(id => id !== videoId)
            }
           
        },


        addPlaylist: (state, action) => {
            state.userPlaylists.unshift(action.payload)
            
        },

        deletePlaylist: (state, action) => {
            state.userPlaylists = state.userPlaylists.filter(pl => pl._id !== action.payload)
            
        },

        setLoading:(state, action)=>{
            state.loading=action.payload;
        }
    }
})


export default playlistSlice.reducer;
export const { fetchUserPlaylists, fetchCurrentPlaylist, addVideoToPlaylist, deleteVideoFromPlaylist, addPlaylist, deletePlaylist, setLoading } = playlistSlice.actions;