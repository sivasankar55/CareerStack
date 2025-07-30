import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getFeedPosts,createComment, createPost, deletePost, getPostById, likePost } from "../controllers/post.controller";

const router = express.Router();


router.get("/", protectRoute,getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/like", protectRoute, likePost);

export default router;  