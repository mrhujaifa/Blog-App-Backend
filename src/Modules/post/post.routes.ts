import express, { Router } from "express";
import { postController } from "./post.controller";

const router: Router = express.Router();

router.get("/", postController.getPosts);

router.post("/", postController.createPost);

export const postRouter = router;
