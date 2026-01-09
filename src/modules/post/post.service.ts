import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost=async(Post:Omit<Post,"id"|"createdAt"|"updatedAt">,id:string)=>{
    const result=await prisma.post.create({data:{...Post,authId:id}});
    return result;
}
const getAllPost=async(payload?:{search?:string|undefined})=>{
    const result=await prisma.post.findMany({
        where: 
        {
            OR:[
                {
                    title:{
                        contains:payload?.search as string,
                        mode:'insensitive'
                    }
                },
                {
                    content:{
                        contains:payload?.search as string,
                        mode:'insensitive'
                    }
                },
                {
                    tags:{
                        has:payload?.search as string
                    }
                }
            ]
        } 
    });
    return result;
}

export const postService={
    createPost,getAllPost
}