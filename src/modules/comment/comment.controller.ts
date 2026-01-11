import { success } from "better-auth/*";
import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment=async(req:Request,res:Response)=>{
try{
  const user=req.user;
  req.body.authorId=user?.id;
  const result=await commentService.createComment(req.body);
  if(result){
    res.status(201).json({success:true,messsage:"Create Comment Successfully",data:result})
  }
}
catch(error){
    res.status(400).json({
        success:false,
        error:"Create Comment Failed",
        details:error
    })
}
}

export const commentController={
    createComment
}