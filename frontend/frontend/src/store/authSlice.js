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
            state.userData=action.payload;
            state.status=true;
        },
        logout:(state)=>{
            state.userData=null;
            state.status=false;
        },
        updateUser:(state,action)=>{
            state.userData= action.payload;
            state.status=true;
        }
    }
})

export const {login,logout,updateUser} =authSlice.actions;
export default authSlice.reducer;