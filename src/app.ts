import express, { Request, Response } from 'express'
import { postRouter } from './modules/post/post.route';
const app=express();
app.use(express.json());
app.use(express.urlencoded());
app.use('/post',postRouter);
app.get('/',(req:Request,res:Response)=>{
    res.json("HELLO WORLD");
})
export default app;