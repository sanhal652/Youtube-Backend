import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, deleteVideoFromPlaylist, getPlayListById, getUserPlaylists, updatePlaylist } from "../controllers/playlist.controller.js"



const router= Router()

router.use(verifyJwt)

router.route("/create-playlist").post(createPlaylist)
router.route("/delete-playlist/:playlistId").delete(deletePlaylist)
router.route("/update-playlist/:playlistId").patch(updatePlaylist)
router.route("/add-video/:playlistId/:videoId").post(addVideoToPlaylist)
router.route("/delete-video/:playlistId/:videoId").delete(deleteVideoFromPlaylist)
router.route("/userPlaylist/:userId").get(getUserPlaylists)
router.route("/playlist/:playlistId").get(getPlayListById)


export default router