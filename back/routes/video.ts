import { Router } from "express";
import { upload } from "../common/uploader";
import { getVideo, getVideos, postVideo } from "../controllers/video";

export const videoRouter = Router();

videoRouter.get('/:videoId', getVideo)
videoRouter.get('/all', getVideos)
videoRouter.post("/upload", upload().single("video"), postVideo);
