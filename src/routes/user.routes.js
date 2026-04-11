import {Router} from "express"
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, refreshAccessToken, updateAccountDetails, updateAvatar, updateCoverImg, userLogin,userLogout, userRegister} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { loginLimiter } from "../middlewares/rateLimiter.middleware.js"

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    userRegister)   //suffix

router.route("/login").post(loginLimiter,userLogin)

//secured routes
router.route("/logout").post(verifyJwt,userLogout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/current-user").get(verifyJwt,getCurrentUser)
router.route("/update-account").patch(verifyJwt,updateAccountDetails)
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateAvatar)
router.route("/update-coverImage").patch(verifyJwt,upload.single("coverImage"),updateCoverImg)
router.route("/c/:username").get(verifyJwt,getUserChannelProfile)
router.route("/watchHistory").get(verifyJwt,getWatchHistory)




export default router