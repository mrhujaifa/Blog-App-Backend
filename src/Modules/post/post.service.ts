import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface CreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags: string[];
}

//* Create a new post service
const createPost = async (payload: CreatePostPayload, authorId: string) => {
  const { title, content, thumbnail, isFeatured, status, tags } = payload;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      tags,
      authorId,
      //! type check if undefined then don't pass the field
      ...(thumbnail !== undefined && { thumbnail }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(status !== undefined && { status }),
    },
  });

  return post;
};

//* Get all posts Service
const getPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};

export const postServices = {
  createPost,
  getPosts,
};
