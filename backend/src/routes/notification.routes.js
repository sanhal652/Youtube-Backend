import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { clearUnreadNotification } from "../controllers/notification.controller.js"



const router= Router()

router.use(verifyJwt)

router.route("/clear").post(clearUnreadNotification)


export default router