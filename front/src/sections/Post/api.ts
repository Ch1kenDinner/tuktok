import { api, apiRoutes } from "../../api";
import { IComment } from "./types";

export const fetchGetComments = async (postId: string) => {
  const { data } = await api.get(apiRoutes.getComments(postId));
  return data.comments;
};

export const fetchPostComment = async (
  postId: string,
  body: { comment: Partial<IComment> }
) => {
  const { data } = await api.post(apiRoutes.postComment(postId), body);
  return data.comments;
};

export const fetchDeletePost = async (postId: string) => {
  await api.delete(apiRoutes.deletePost(postId));
};

export const fetchCommentLike = (
  reaction: "like" | "dislike",
  commentId: string
) => {
  return api.patch(apiRoutes.postLike(reaction, commentId));
};

export const fetchPatchComment = async (
  commentId: string,
  body: Record<string, any>
) => {
  return await api.patch(apiRoutes.patchComment(commentId), body);
};

export const fetchLikePost = async (postId: string) => {
  return await api.patch(apiRoutes.likePost(postId));
};
