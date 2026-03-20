import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { uploadVideo } from "../controllers/video.controller.js"

const router=Router()

router.route("/upload-video").post(verifyJwt,
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        },
        {
            name:"videoFile",
            maxCount:1
        }
    ]),uploadVideo)

export default router