import { Router } from "express";
import { apiRoutes } from ".";
import { getVideo } from "../controllers/video";


export const videoRouter = Router()

videoRouter.get('/:videoId', getVideo)