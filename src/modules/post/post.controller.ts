import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { boolean, success } from "better-auth/*";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { prisma } from "../../lib/prisma";
import { userRole } from "../../middleware/auth";

const createPost = async (req: Request, res: Response,next:NextFunction) => {
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
    
  } catch (error) {
    next(error);
    // const errorMessage=(error instanceof Error)?error.message:"Post creation Failed";
    // res.status(400).json({ success: false,error:errorMessage, details:error});
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search, tags, isFeatured, status, authId } = req?.query;
    //type defined
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
    //generate pagination
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
  } catch (error) {
    const errorMessage=(error instanceof Error)?error.message:"Failed to fetch data";
    res.status(400).json({ success: false,error:errorMessage ,details:error });
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
    const errorMessage=(error instanceof Error)?error.message:"Failed to fetch data";
   res.status(400).json({
      success:false,
      error:errorMessage,
      details:error
    })
  }
}



const getMyPost=async(req:Request,res:Response)=>{
try{
const user=req.user;
if(!user){
  throw new Error('You are unauthorized');
}
const result=await postService.getMyPost(user?.id as string);
res.status(200).json(result);
}
catch(error){
const errorMessage=(error instanceof Error)?error.message:"Failed to fetch data";
res.status(400).json({
    success:false,
    error:errorMessage,
    details:error
  })
}
}


const updatePost=async(req:Request,res:Response)=>{
  try{
  const user=req.user;
  const{postId}=req.params;
  if(!user){
    throw new Error('You are unauthorized');
  }
const isAdmin=user?.role === userRole.ADMIN;
const result=await postService.updatePost(Number(postId),req.body, user?.id,isAdmin);
res.status(200).json(result);
  }
  catch(error){
  const errorMessage=(error instanceof Error)?error.message:"Post Update failed";
  res.status(400).json({
      success:false,
      error:errorMessage,
      details:error
    })
  }
  }


  const deletePost=async(req:Request,res:Response)=>{
    try{
    const user=req.user;
    const{postId}=req.params;
    if(!user){
      throw new Error('You are unauthorized');
    }
  const isAdmin=user?.role === userRole.ADMIN;
  const result=await postService.deletePost(Number(postId), user?.id,isAdmin);
  res.status(200).json(result);
    }
    catch(error){
    const errorMessage=(error instanceof Error)?error.message:"Post delete failed";
    res.status(400).json({
        success:false,
        error:errorMessage,
        details:error
      })
    }
    }

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updatePost,
  deletePost
};
