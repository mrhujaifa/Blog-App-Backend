import express, { Router } from "express";
import { postController } from "./post.controller";
import { verifyAuth } from "../../middlewares/verifyAuth";
import { requireAuth } from "../../middlewares/Auth";
const router: Router = express.Router();

router.get("/", verifyAuth("USER"), requireAuth, postController.getPosts);

router.post("/", requireAuth, postController.createPost);

export const postRouter = router;
