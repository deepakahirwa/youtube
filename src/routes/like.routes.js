import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    togglePostLike,
    getLikedPost,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/p/:postId").post(togglePostLike);
router.route("/videos").get(getLikedVideos);
router.route("/post").get(getLikedPost);
export default router