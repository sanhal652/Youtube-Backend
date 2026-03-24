import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js"


const router= Router()

router.use(verifyJwt)

router.route("/add-tweet").post(addTweet)
router.route("/delete-tweet/t/:tweetId").delete(deleteTweet)
router.route("/update-tweet/t/:tweetId").patch(updateTweet)
router.route("/user-tweet/u/:userId").get(getUserTweets)


export default router