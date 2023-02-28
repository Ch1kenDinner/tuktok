import { Router } from "express";
import { postAvatar } from "../controllers/user";
import { auth } from "../middleware/auth";


export const userRouter = Router()

userRouter.patch('/upload/avatar', auth, postAvatar)