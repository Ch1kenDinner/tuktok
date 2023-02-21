import { Router } from "express";
import { postLogin } from "../controllers/login";


export const loginRouter = Router()

loginRouter.post('/', postLogin)