import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, togglePublicStatus, updateVideo, uploadVideo,getVideoSummary } from "../controllers/video.controller.js"
import { client } from "../db/redis.js"

const router=Router()

router.route("/upload").post(verifyJwt,
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

router.route("/delete/:videoId").delete(verifyJwt,deleteVideo)
router.route("/update/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateVideo)
router.route("/video/:videoId").get(getVideoById)
router.route("/all-videos").get(getAllVideos)
router.route("/toggle/:videoId").patch(verifyJwt,togglePublicStatus)
router.route("/summary/:videoId").get(verifyJwt,getVideoSummary)

export default router