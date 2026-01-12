import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { success } from "better-auth/*";

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
    const errorMessage=(error instanceof Error)?error.message:"Create Comment Failed";
    res.status(400).json({
        success:false,
        error:errorMessage,
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
        const errorMessage=(error instanceof Error)?error.message:"Comment fetched failed";

        res.status(400).json({
            success:false,
            details:error,
            error:errorMessage
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
res.status(200).json(result);
}
catch(error){
    const errorMessage=(error instanceof Error)?error.message:"Comment fetched failed";

    res.status(400).json({
        success:false,
        details:error,
        error:errorMessage
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
          if(result){
            res.status(200).json({
                success:true,
                message:"Comment deleted Successfully",
                data:result
            })
          }
    }
    catch(error){
        const errorMessage=(error instanceof Error)?error.message:'Comment deletion failed';
        res.status(400).json({
            success:false,
            details:error,
            error:errorMessage

        })
    }
}

const updateComment=async(req:Request,res:Response)=>{
    try{
        const {commentId}=req.params;
        const user=req?.user;
        if(!commentId){
          throw new Error('commentId is required');
        }
        
        const result=await commentService.updateComment({authorId:user?.id as string,id:Number(commentId) ,data:req.body});
        res.status(201).json({
            success:false,
            message:"comment updated successfully",
            data:result

        })
    }
    catch(error){
        const errorMessage=(error instanceof Error)?error.message:"Comment Update failed";
        res.status(400).json({
            success:false,
            details:error,
            error:errorMessage
        })
    }
}

export const commentController={
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment
}