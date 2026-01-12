import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middleware/auth";

const route=Router();

route.post('/',auth(userRole.ADMIN,userRole.USER),postController.createPost);
route.get('/',postController.getAllPost);
route.get('/my-posts',auth(userRole.ADMIN,userRole.USER),postController.getMyPost)
route.get('/:postId',postController.getPostById);
route.patch("/:postId",auth(userRole.ADMIN,userRole.USER),postController.updatePost);

export const postRouter:Router=route;