// require ('dotenv').config({path:'./env'})

import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
import connectDB from "./db";

const app=express();

connectDB();

//we will be using IIFE to connect to the database and start the server

//1st approach

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("Error in connecting to the database");
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is running on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error",error);
//         throw error;
//     }
// })()