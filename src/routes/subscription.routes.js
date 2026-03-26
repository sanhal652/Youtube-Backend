import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { getUserChannelSubscribers, toggleSubscriptionStatus,getSubscribedChannels } from "../controllers/subscription.controller.js"



const router= Router()

router.use(verifyJwt)

router.route("/toggle-sub/:channelId").post(toggleSubscriptionStatus)
router.route("/subscribers/:channelId").get(getUserChannelSubscribers)
router.route("/my-subscription").get(getSubscribedChannels)


export default router