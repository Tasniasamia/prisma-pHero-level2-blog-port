import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost=async(req:Request,res:Response)=>{
    try{
    const result=await postService.createPost(req.body as Omit<Post,"id"|"createdAt"|"updatedAt">);
    if(result){
        res.status(200).json({success:true,data:JSON.stringify(result)});
    }
}
catch(error:any){
    res.status(400).json({success:false,message:error.message})

}
}

export const postController={
    createPost
}