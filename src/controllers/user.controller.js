import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


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
        new ApiResponse(201, createdUser, "User registered successfully")
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
            $set: { refreshToken: null }  //we delete the refresh token from database
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

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken, refreshToken
                },
                    "Access token refreshed successfully "
                ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


//update password

const changeCurrentPassword = asyncHandler(async (req, res) => {
    //we take the old and new passwords from the user
    const { oldPassword, newPassword, confirmPassword } = req.body
     
    if(!newPassword || !oldPassword || !confirmPassword)
        throw new ApiError(400,"Old password, new password and confirm password are required")
    //check new and confirm password
    if (newPassword !== confirmPassword)
        throw new ApiError(400, "New Password and confirm password not matching")

    //get that user
    const user = await User.findById(req.user?._id).select("+password")

    //check whether the password given by the user matches
    const isCorrectPassword = await user.isPasswordCorrect(oldPassword)
    if (!isCorrectPassword)
        throw new ApiError(400, "Password invalid")

    //now change the password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })


    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})

//get logged in user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

//update account details

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!fullName || !email)
        throw new ApiError(400, "Fullname or email is required")
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName,
            email
        }
    }, { new: true }).select("-password -refreshToken")   //new :true = means it will return the updated data
    return res.status(200).
        json(
            new ApiResponse(200, user, "User credentials updated successfully")
        )

})

//update user avatar

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath)
        throw new ApiError(400, "Avatar file is  missing")
    const user = await User.findById(req.user?._id)
    const oldAvatar = user?.avatar
    const avatar = await uploadCloudinary(avatarLocalPath)
    if (!avatar.url)
        throw new ApiError(400, "Error while updating on avatar")

    if (oldAvatar) {
        const publicId = oldAvatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true }
    ).select("-password")
    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Avatar updated successfully")
    )
})

//updating coverImage

const updateCoverImg = asyncHandler(async (req, res) => {
    const coverImagePath = req.file?.path
    if (!coverImagePath)
        throw new ApiError(400, "Cover image is missing")
    const user = await User.findById(req.user?._id)
    const oldCoverImg = user?.coverImage
    const coverImage = await uploadCloudinary(coverImagePath)
    if (!coverImage.url)
        throw new ApiError(400, "Error in updating cover image")

    if (oldCoverImg) {
        const publicId = oldCoverImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        }, { new: true }
    ).select("-password")
    return res.status(200).json(
        new ApiResponse(200, updatedUser, "CoverImage updated successfully")
    )
})


//get channel details
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim())
        throw new ApiError(400, "Username not found")
    const channel = await User.aggregate([
        {
            $match: {    //Filters documents based on a specified query predicate.
                //  Matched documents are passed to the next pipeline stage.
                username: username?.toLowerCase()
            }
        },
        //here we are finding the subscribers of a channel
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",   //This is the field from the current collection (the one you are already in)
                foreignField: "channel", //This is the field in the other collection (the one you are "looking into").
                as: "subscribers"
            }
        },
        //we are finding the channels i have subscribed to
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedTo: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },    //in : search operator
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            //we use this for showing  selected info in the frontend
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedTo: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1

            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist")
    }
    return res.status(200)
        .json(new ApiResponse(200, channel[0], "User channel fetched successfully"))
})

//nested lookup

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            //match mainly determines how the application will identify
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        // here we will  get many documents in watch history field
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                //in watch history we are getting all the video documents
                //but in video model there is a field caller owner which references user
                //so we are making a sub-pipeline to connect with the user
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            //here in owner field we will get all the details of user which is not reqd
                            //so we add another pipeline to send only the required data
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"   //turns array into object
                            }
                        }
                    }
                ]
            }
        }
    ])
    if (!user.length)
        throw new ApiError(500, "Unable to fetch user")
    return res.status(200)
        .json(
            new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully")
        )
})

export {
    userRegister, userLogin, userLogout, refreshAccessToken, changeCurrentPassword, getCurrentUser,
    updateAccountDetails, updateAvatar, updateCoverImg, getUserChannelProfile, getWatchHistory
} 