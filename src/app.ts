import express, { Request, Response } from 'express'
import { postRouter } from './modules/post/post.route';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { commentRouter } from './modules/comment/comment.router';
import errorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';

const app=express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: ["http://localhost:3000","http://localhost:4000"],credentials:true }));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use('/post',postRouter);
app.use('/comment',commentRouter);
app.use(notFound);
app.use(errorHandler);
app.get('/',(req:Request,res:Response)=>{
    res.json("HELLO WORLD");
})
export default app;