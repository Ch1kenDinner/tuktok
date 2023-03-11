import { Router } from "express";
import { deletePost, getComments, getPosts, postComment, postVideo } from "../controllers/post";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/uploader";

export const postRouter = Router();

postRouter.get("/all", getPosts);
postRouter.get('/:postId/comments', getComments)
postRouter.post("/upload", auth, upload().single("video"), postVideo);
postRouter.post('/byTopics', getPosts)
postRouter.post('/:postId/comment', auth, postComment)
postRouter.delete('/:postId', auth, deletePost)