import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middleware/auth";

const route=Router();

route.post('/',auth(userRole.ADMIN,userRole.USER),postController.createPost);
route.get('/',postController.getAllPost);
route.get('/:postId',postController.getPostById);
route.get('/my-posts',auth(userRole.ADMIN,userRole.USER),postController.getMyPost)

export const postRouter:Router=route;