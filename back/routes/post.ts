import { Router } from "express";
import { deletePost, getComments, getPosts, likePost, postComment, postVideo } from "../controllers/post";
import { auth, passUserId } from "../middleware/auth";
import { upload } from "../middleware/uploader";

export const postRouter = Router();

postRouter.get("/all", passUserId, getPosts);
postRouter.get('/:postId/comments', getComments)
postRouter.post("/upload", auth, upload().single("video"), postVideo);
postRouter.post('/byTopics', passUserId, getPosts)
postRouter.post('/:postId/comment', auth, postComment)
postRouter.patch('/:postId/like', auth, likePost)
postRouter.delete('/:postId', auth, deletePost)