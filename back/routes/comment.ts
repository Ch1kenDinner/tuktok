import { Router } from "express";
import { postLike } from "../controllers/comment";
import { auth } from "../middleware/auth";


export const commentRouter = Router()

commentRouter.patch('/:commentId/:reaction', auth, postLike)
