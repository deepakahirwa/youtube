import { Router } from 'express';
import {
    createPost,
    deletePost,
    getUserPost,
    updatePost,
} from "../controllers/post.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPost);
router.route("/user/:userId").get(getUserPost);
router.route("/:tweetId").patch(updatePost).delete(deletePost);

export default router