import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { boolean } from "better-auth/*";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(
      req.body as Omit<Post, "id" | "createdAt" | "updatedAt">,
      req?.user?.id as string
    );
    console.log("result", result);
    if (result) {
      res
        .status(200)
        .json({
          success: true,
          message: "post created successfully",
          data: JSON.stringify(result),
        });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search, tags, isFeatured, status, authId } = req?.query;

    const searchString = typeof search === "string" ? search : undefined;
    const tagsArray = (typeof tags === "string" && tags?.split(",")) || [];
    console.log("isFeatured",typeof isFeatured);
    
    const postFeatured=isFeatured as string|any;
    const featured =
    postFeatured === "true" || postFeatured === true
      ? true
      : postFeatured === "false" || postFeatured === false
      ? false
      : undefined;
  

    const statusPost = status as PostStatus;
    const Id = authId as string;
    const result = await postService.getAllPost({
      search: searchString,
      tags: tagsArray,
      isFeatured: featured,
      status: statusPost,
      authId: Id,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
