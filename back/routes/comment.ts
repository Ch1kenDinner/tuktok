import { Router } from "express";
import { patchComment, postLike } from "../controllers/comment";
import { auth } from "../middleware/auth";


export const commentRouter = Router()

commentRouter.patch('/:commentId', auth, patchComment)
commentRouter.patch('/:commentId/:reaction', auth, postLike)
