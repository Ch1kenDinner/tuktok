import { Router } from "express";
import { getPostsPreview, getVideo, postVideo } from "../controllers/post";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/uploader";

export const videoRouter = Router();

videoRouter.get("/all", getPostsPreview);
videoRouter.get("/:videoId", getVideo);
videoRouter.post("/upload", auth, upload().single("video"), postVideo);
