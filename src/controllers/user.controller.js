import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
const userRegister= asyncHandler( async (req,res)=>
{
   // get user details from frontend
   // validation - not empty etc....
   //check if user already exists: username ,email
   //check for images
   //upload them to cloudinary,check for avatar
   // create object- create entry in db
   //remove password and refersh token field from response
   //check for user creation: if created then response ,if not then return error

    const {fullName, username, email, password}=req.body
// simple method , we have to use it to verify all the fields.

    // if(fullName===""){
    //     throw new ApiError(400,"Fullname is required");    
    // }

    //another advance method

    if( [fullName,email,username,password].some((field)=> field?.trim()===""))
    {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser= User.findOne({
        $or:[{email},{username}]
    })
    if (existedUser)
    {
        throw new ApiError(409,"User already exists")
    }

    //handling images

    const avatarLocalPath= req.files?.avatar[0]?.path
    const coverImgLocalPath= req.files?.coverImage[0]?.path
    if(!avatarLocalPath)
        throw new ApiError(400,"Avatar file is required")

    const avatar=  await uploadCloudinary(avatarLocalPath)
    const coverImage=  await uploadCloudinary(coverImgLocalPath)
    if (!avatar) 
          throw new ApiError(400,"Avatar file is required")
    
     const user= await User.create({fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || " ",
        username:username.toLowerCase(),
        email,
        password
    })
     const createdUser= await User.findById(user._id).select(      //here we write those fields which we dont want to select
        "-password -refreshToken"
     )
     if(!createdUser)
        throw new ApiError(500, "Somehting went wrong while registering user")

     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
     )
})

export {userRegister}