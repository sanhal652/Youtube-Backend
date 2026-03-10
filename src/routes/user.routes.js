import {Router} from "express"
import { userRegister, userLogin } from "../controllers/user.controller.js"
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
            maxCount:1
        }
    ]),
    userRegister)   //suffix
router.route("/login").post(userLogin)



export default router