import { Request, Response } from "express";
import { postServices } from "./post.service";

//* Create a new post controller
const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await postServices.createPost(req.body, user.id);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

//* Get all posts controller
const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await postServices.getPosts();
    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve posts",
      error: error.message,
    });
  }
};

export const postController = {
  createPost,
  getPosts,
};
