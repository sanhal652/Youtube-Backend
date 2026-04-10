import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { client } from "../db/redis.js"


//updating the bell icon when the owner has already checked the notification

const clearUnreadNotification= asyncHandler(async (req,res) => {
    const owner=req.user?._id.toString()
    const deletedNotificationCount= await client.hDel("notification:unread",owner)

    if(deletedNotificationCount===0)
    {
        return res.status(200)
        .json(new ApiResponse(200,{},"No unread notification "))
    }
    else if(deletedNotificationCount>0)
    {
        return res.status(200)
        .json(new ApiResponse(200,{},"Notifications cleared successfully"))
    }
})

export {clearUnreadNotification}