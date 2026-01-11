import { prisma } from "../../lib/prisma"

const createComment=async(payload:{
    content:string,
    authorId:string,
    postId:number,
    parentId?:number
})=>{
 await prisma.post.findUniqueOrThrow({
    where:{id:payload.postId}
 });
 if(payload.parentId){
    await prisma.comment.findUniqueOrThrow({
        where:{id:payload.parentId}
     });
 }
 return await prisma.comment.create({
    data:payload
 });
}
const getCommentById=async(id:{id:number})=>{
 return prisma.comment.findUnique({
    where:id,
    include:{replies:true,posts:true}
 })
}

const getCommentByAuthor=async(authorId:{authorId:string})=>{
    return await prisma.comment.findMany({
        where:authorId,
        include:{replies:true,posts:true},orderBy:{createdAt:'desc'}
        
    })
}

const deleteComment=async({authorId,id}:{authorId:string,id:number})=>{
   await prisma.comment.findFirstOrThrow({
    where:{
       authorId,id
    }
   });
   return prisma.comment.delete({where:{id}});
}





export const commentService={
createComment,
getCommentById,
getCommentByAuthor,
deleteComment
}