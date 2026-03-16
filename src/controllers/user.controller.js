import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //store refresh token in database and save it

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        //return both tokens to user
        return { accessToken, refreshToken }

    } catch (error) {
        //    console.log("--- TOKEN GENERATION ERROR ---");
        //     console.log("MESSAGE:", error.message);
        //     console.log("STACK:", error.stack);
        //     console.log("------------------------------");
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}
const userRegister = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty etc....
    //check if user already exists: username ,email
    //check for images
    //upload them to cloudinary,check for avatar
    // create object- create entry in db
    //remove password and refersh token field from response
    //check for user creation: if created then response ,if not then return error

    const { fullName, username, email, password } = req.body
    // simple method , we have to use it to verify all the fields.

    // if(fullName===""){
    //     throw new ApiError(400,"Fullname is required");    
    // }

    //another advance method

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    //handling images

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImgLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImgLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath)
        throw new ApiError(400, "Avatar file is required")

    const avatar = await uploadCloudinary(avatarLocalPath)
    let coverImage = null;
    if (coverImgLocalPath) {
        coverImage = await uploadCloudinary(coverImgLocalPath)
    }
    if (!avatar)
        throw new ApiError(400, "Avatar file is required")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username?.toLowerCase(),
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(      //here we write those fields which we dont want to select
        "-password -refreshToken"
    )
    if (!createdUser)
        throw new ApiError(500, "Something went wrong while registering user")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

//user logged in function  

const userLogin = asyncHandler(async (req, res) => {
    //take data from user
    const { email, password, username } = req.body;

    //check whether email or username is there or not
    if (!(email || username))
        throw new ApiError(400, "Username or email is required")


    //check whether user exists or not
    const user = await User.findOne({
        $or: [{ email }, { username }]

    }).select("+password")
    if (!user)
        throw new ApiError(404, "User does not exist")

    //check password if user exists
    const passwordCheck = await user.isPasswordCorrect(password)
    if (!passwordCheck)
        throw new ApiError(401, "Invalid user credentials")

    //generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    //get the user
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //send cookies

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in successfully"
            )
        )

})

//logout functon

const userLogout = asyncHandler(async (req, res) => {
    //we get the access token from the middleware
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: undefined }  //we delete the refresh token from database
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})


const refreshAccessToken = asyncHandler(async (req, res) =>    //if the access token expires then the user 
// can regenerate a new access token from refresh token
{

    //ask for token from frontend
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  //req.body for mobile and req.cookies for desktop
        if (!incomingRefreshToken)
            throw new ApiError(401, "Unauthorized request")

        //check whether the incoming token and the token created by our server matches
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        //get the user
        const user = await User.findById(decodedRefreshToken?._id)
        if (!user)
            throw new ApiError(401, "Invalid refresh token")

        //verify the incoming token send by the user and the one in our database
        if (incomingRefreshToken !== user?.refreshToken)
            throw new ApiError(401, "Refresh token is expired or used")

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken,refreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken, refreshToken
                },
                    "Access token refreshed successfully "
                ))
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid refresh token")
    }

})


//update account info

const changeCurrentPassword=asyncHandler(async(req,res)=>
{
    //we take the old and new passwords from the user
    const {oldPassword,newPassword,confirmPassword} =req.body
    
    //check new and confirm password
     if(newPassword!==confirmPassword)
        throw new ApiError(400,"New Password and confirm password not matching")

    //get that user
    const user=await User.findById(req.user?._id).select("+password")

    //check whether the password given by the user matches
    const isCorrectPassword=  await user.isPasswordCorrect(oldPassword)
    if(!isCorrectPassword)
        throw new ApiError(400,"Password invalid")

    //now change the password
        user.password=newPassword
        await user.save({ validateBeforeSave: false })
    
        
    return res.status(200).json(
        new ApiResponse(200,{},"Password changed successfully")
    )
})

export { userRegister, userLogin, userLogout, refreshAccessToken, changeCurrentPassword }