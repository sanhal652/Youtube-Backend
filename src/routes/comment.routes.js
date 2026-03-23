import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js"

const router= Router()


router.route("/add-comment/:videoId").post(verifyJwt,addComment)
router.route("/update-comment/:commentId").patch(verifyJwt,updateComment)
router.route("/delete-comment/:commentId").delete(verifyJwt,deleteComment)
router.route("/video-comments/:videoId").get(verifyJwt,getVideoComments)
export default router