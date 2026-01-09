import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost=async(Post:Omit<Post,"id"|"createdAt"|"updatedAt">,id:string)=>{
    const result=await prisma.post.create({data:{...Post,authId:id}});
    return result;
}

export const postService={
    createPost
}