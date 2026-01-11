import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const route=Router();

route.post('/',auth(userRole.ADMIN,userRole.USER),commentController.createComment);
route.get('/:commentId',commentController.getCommentById);
route.get('/author/:authorId',auth(userRole.ADMIN,userRole.USER),commentController.getCommentByAuthor);
route.delete('/:commentId',auth(userRole.ADMIN,userRole.USER),commentController.deleteComment);
route.patch('/:commentId',auth(userRole.ADMIN,userRole.USER),commentController.updateComment);


export const commentRouter:Router=route;