import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middleware/auth";

const route=Router();

route.post('/',auth(userRole.ADMIN,userRole.USER),postController.createPost);

export const postRouter:Router=route;