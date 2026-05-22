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
        fetchUserPlaylistsStore: (state, action) => {
            state.userPlaylists = action.payload;
        
        },


        fetchCurrentPlaylistStore: (state, action) => {
            state.currentPlaylist = action.payload;
            
        },


        addVideoToPlaylistStore: (state, action) => {
            const { playlistId, videoId } = action.payload;
            const playlist = state.userPlaylists.find(pl => pl._id === playlistId);
            if (playlist) {
                if (!playlist.videos.includes(videoId)) {  //prevent duplicates
                    playlist.videos.push(videoId); 
                }
            }
            if(state.currentPlaylist && state.currentPlaylist._id===playlistId){
                if(!state.currentPlaylist.videosInPlaylist){
                    state.currentPlaylist.videosInPlaylist=[]
                }
                if(!state.currentPlaylist.videosInPlaylist.some(video=>video._id===videoId)){
                    state.currentPlaylist.videosInPlaylist.push({_id:videoId})
                }
            }
            
        },


        deleteVideoFromPlaylistStore: (state, action) => {
            const { playlistId, videoId } = action.payload;

            //for sidebar
            const playlist = state.userPlaylists.find(pl => pl._id === playlistId);
            if (playlist) {
                playlist.videos = playlist.videos.filter(id => id !== videoId)
            }

            //for current playlist
            if(state.currentPlaylist && state.currentPlaylist._id===playlistId){
                state.currentPlaylist.videosInPlaylist = state.currentPlaylist.videosInPlaylist.filter(video => video._id !== videoId)
            }
           
        },


        addPlaylistStore: (state, action) => {
            state.userPlaylists.unshift(action.payload)
            
        },

        deletePlaylistStore: (state, action) => {
            state.userPlaylists = state.userPlaylists.filter(pl => pl._id !== action.payload)
            
        },

        setLoading:(state, action)=>{
            state.loading=action.payload;
        }
    }
})


export default playlistSlice.reducer;
export const { fetchUserPlaylistsStore, fetchCurrentPlaylistStore, addVideoToPlaylistStore, deleteVideoFromPlaylistStore, addPlaylistStore, deletePlaylistStore, setLoading } = playlistSlice.actions;