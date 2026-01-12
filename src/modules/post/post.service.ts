import {
  CommentStatus,
  Post,
  PostStatus,
  UserRole,
} from "../../../generated/prisma/client";
import {
  PostWhereInput,
  PostWhereUniqueInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  Post: Omit<Post, "id" | "createdAt" | "updatedAt">,
  id: string
) => {
  const result = await prisma.post.create({ data: { ...Post, authId: id } });
  return result;
};
const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const anyConditions: PostWhereInput[] = [];
  if (search) {
    anyConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (tags && tags.length > 0) {
    console.log("tasg", tags);

    anyConditions.push({
      tags: {
        hasSome: tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    anyConditions.push({ isFeatured });
  }
  if (status) {
    anyConditions.push({ status });
  }
  if (authId) {
    anyConditions.push({ authId });
  }
  const allPost = await prisma.post.findMany({
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    where: { AND: anyConditions },
    include:{
      _count: {
        select: { comments: true },
      },
    }
  });
  const total = await prisma.post.count({
    where: { AND: anyConditions },
  });
  return {
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },

    data: allPost,
  };
};
const getPostById = async (postId: number) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
    const result = await tx.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          where: { parentId:null, status: CommentStatus.APPROVED },
          orderBy:{createdAt:'desc'},
          include: { replies: {where:{status:CommentStatus.APPROVED},orderBy:{createdAt:'asc'},
          include:{replies:{where:{status:CommentStatus.APPROVED},orderBy:{createdAt:'asc'}}}} },
        },
        _count: {
          select: { comments: true },
        },
      },
      
      
    
    });
    return result;
  });
};
const getMyPost=async(authId:string)=>{
await prisma.user.findUniqueOrThrow({
  where:{id:authId,status:'ACTIVE'}
})
const result= await prisma.post.findMany({
  where:{authId:authId},
  orderBy:{createdAt:'desc'},
  include:{
    _count:{
      select:{
        comments:true
      },
    }
  }
  
})

return result
}
export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost
};
