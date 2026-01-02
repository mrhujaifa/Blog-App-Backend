import e from "express";
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

//* Get all search posts Service
const getPosts = async (payload: {
  search?: string | undefined;
  tags?: string[] | [];
}) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        //! why use AND here?
        //* because we want to apply multiple conditions together.
        AND: [
          {
            //! why use OR here?
            //* because we want to search in multiple fields (title, content, tags).
            OR: [
              {
                title: {
                  contains: payload.search as string,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: payload.search as string,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  has: payload.search as string,
                },
              },
            ],
          },
          {
            tags: {
              //! why use hasEvery here?
              //* because we want to filter posts that contain all the specified tags.
              hasEvery: [...(payload.tags as string[])],
            },
          },
        ],
      },
    });
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const postServices = {
  createPost,
  getPosts,
};
