import { Router } from "express";
import { getPosts, getPostsByTopics, postVideo } from "../controllers/post";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/uploader";

export const postRouter = Router();

postRouter.get("/all", getPosts);
postRouter.post("/upload", auth, upload().single("video"), postVideo);
postRouter.post('/byTopics', getPostsByTopics)