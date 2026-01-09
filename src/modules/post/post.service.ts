import { Post, PostStatus } from "../../../generated/prisma/client";
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
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authId: string | undefined;
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
  if (tags && tags?.length > 0) {
    anyConditions.push({
      tags: {
        has: search as string,
      },
    });
  }
  if (typeof isFeatured==="boolean") {
    anyConditions.push({ isFeatured });
  }
  if(status){
    anyConditions.push({status})
  }
  if(authId){
    anyConditions.push({authId})
  }
  const result = await prisma.post.findMany({
    where:  { AND: anyConditions },
  });
  return result;
};

export const postService = {
  createPost,
  getAllPost,
};
