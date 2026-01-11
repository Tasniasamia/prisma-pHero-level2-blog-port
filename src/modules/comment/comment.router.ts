import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const route=Router();

route.post('/',auth(userRole.ADMIN,userRole.USER),commentController.createComment);


export const commentRouter:Router=route;