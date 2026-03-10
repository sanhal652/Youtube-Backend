import {Router} from "express"
import { userRegister } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:2
        }
    ]),
    userRegister)   //suffix
//router.route("/login").post(userRegister)

export default router