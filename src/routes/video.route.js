import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, togglePublicStatus, updateVideo, uploadVideo } from "../controllers/video.controller.js"

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

router.route("/delete-video/:videoId").delete(verifyJwt,deleteVideo)
router.route("/update-video/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateVideo)
router.route("/video/:videoId").get(verifyJwt,getVideoById)
router.route("/all-videos").get(verifyJwt,getAllVideos)
router.route("/toggle/:videoId").patch(verifyJwt,togglePublicStatus)

export default router