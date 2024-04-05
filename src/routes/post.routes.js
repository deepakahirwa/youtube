import { Router } from 'express';
import {
    createPost,
    deletePost,
    getUserPost,
    updatePost,
    
} from "../controllers/post.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {upload} from '../middleware/multer.middleware.js'
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(  upload.array("postContent",8),createPost);
router.route("/user").get(getUserPost);
router.route("/:postId").patch(updatePost).delete(deletePost);

export default router