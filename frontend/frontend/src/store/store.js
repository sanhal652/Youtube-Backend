import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import videoSlice from "./videoSlice";
import playlistSlice from "./playlistSlice";
import subscriptionSlice from "./subscriptionSlice";
import likeSlice from "./likeSlice";

const store= configureStore({
    reducer:{
        auth: authSlice,
        video: videoSlice,
        playlist: playlistSlice,
        subscription:subscriptionSlice,
        like:likeSlice
    }
})


export default store;