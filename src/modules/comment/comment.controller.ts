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
const getCommentById=async(req:Request,res:Response)=>{
    try{
      const {commentId}=req.params;
      if(!commentId){
        throw new Error('commentId is required');
      }
      const result=await commentService.getCommentById({id:Number(commentId)});
      res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({
            success:false,
            details:error,
            error:"Comment fetched failed"
        })
    }
}

const getCommentByAuthor=async(req:Request,res:Response)=>{
try{
const {authorId}=req.params;
if(!authorId){
    throw new Error('Author Id is required');
}
const result=await commentService.getCommentByAuthor({authorId:authorId})
}
catch(error){
    res.status(400).json({
        success:false,
        details:error,
        error:"Comment fetched failed"
    })
}
}

const deleteComment=async(req:Request,res:Response)=>{
    try{
         const user=req.user;
         const {commentId}=req.params;
         if(!commentId){
            throw new Error('commentId is required');
          }   
          const result=await commentService.deleteComment({authorId:user?.id as string,id:Number(commentId)})
    }
    catch(error){
        res.status(400).json({
            success:false,
            details:error,
            error:'Delete comment failed'

        })
    }
}

export const commentController={
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment
}