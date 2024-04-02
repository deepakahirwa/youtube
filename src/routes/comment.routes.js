import { Router } from 'express';
import {
    addVideoComment,
    deleteComment,
    getVideoComments,
    updateComment,
    getPostComments
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/videos/:videoId").get(getVideoComments).post(addVideoComment);
router.route("/post/:PostId").get(getPostComments).post(addVideoComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router