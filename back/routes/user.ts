import { Router } from "express";
import { patchUser } from "../controllers/user";
import { auth } from "../middleware/auth";


export const userRouter = Router()

userRouter.patch('/', auth, patchUser)