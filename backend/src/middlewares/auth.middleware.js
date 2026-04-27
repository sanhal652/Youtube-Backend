import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

 export const verifyJwt= asyncHandler(async(req,res,next)=>
{

    try {
        //extracting the token , either we get it from the access token 
        // from the user or the user themselves upload
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token)
            throw new ApiError(401,"Unauthorized request")
    
        //we check whether the token is correct or not
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user)
            throw new ApiError(401,"Invalid access token")
    
        //By attaching the user data to req.user, 
        // every controller that comes after this middleware (like logoutUser or updateAccount) 
        // can simply access req.user to know exactly who is performing the action.
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid User")
    }
}) 