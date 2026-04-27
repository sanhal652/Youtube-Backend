import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { channelStats, getChannelVideos } from "../controllers/dashboard.controller.js"


const router= Router()

router.use(verifyJwt)

router.route("/channel/:channelId").get(channelStats)
router.route("/videos/:channelId").get(getChannelVideos)


export default router