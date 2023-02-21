import { Router } from "express";
import { apiRoutes } from ".";
import { getTopics } from "../controllers/topic";

export const topicsRouter = Router();

topicsRouter.get('/all', getTopics);
