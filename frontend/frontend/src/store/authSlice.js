import { createSlice } from "@reduxjs/toolkit";
const initialState={
    userData:null,
    status:false             //to check whether use is logged in or not
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.userData=action.payload.userData;
            state.status=true;
        },
        logout:(state,action)=>{
            state.userData=null;
            state.status=false;
        }
    }
})

export const {login,logout} =authSlice.actions;
export default authSlice.reducer;