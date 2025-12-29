import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost=async(Post:Omit<Post,"id"|"createdAt"|"updatedAt">)=>{
    const result=await prisma.post.create({data:Post});
    return result;
}

export const postService={
    createPost
}