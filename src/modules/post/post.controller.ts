import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { boolean, success } from "better-auth/*";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(
      req.body as Omit<Post, "id" | "createdAt" | "updatedAt">,
      req?.user?.id as string
    );

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
    res.status(400).json({ success: false,error:"Post creation Failed", details:error});
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search, tags, isFeatured, status, authId } = req?.query;

    const searchString = typeof search === "string" ? search : undefined;
    const tagsArray = (typeof tags === "string" && tags?.split(",")) || [];
    const postFeatured=isFeatured as string|any;
    const featured =
    postFeatured === "true" || postFeatured === true
      ? true
      : postFeatured === "false" || postFeatured === false
      ? false
      : undefined;
  

    const statusPost = status as PostStatus;
    const Id = authId as string;
    console.log("query data",req?.query)
    const {page,limit,skip,sortBy,sortOrder}= paginationSortingHelper(req.query);

    const result = await postService.getAllPost({
      search: searchString,
      tags: tagsArray,
      isFeatured: featured,
      status: statusPost,
      authId: Id,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(400).json({ success: false,error:"Failed to fetch data" ,details:error });
  }
};

const getPostById=async(req:Request,res:Response)=>{
  try{
 const {postId}= req?.params;
 if(!postId){
  throw new Error('Post Id is required!');
 }
const id=Number(postId)
const result=await postService.getPostById(id);
res.status(200).json(result);

  }
  catch(error){
    res.status(400).json({
      success:false,
      error:"",
      details:error
    })
  }
}

export const postController = {
  createPost,
  getAllPost,
  getPostById
};
