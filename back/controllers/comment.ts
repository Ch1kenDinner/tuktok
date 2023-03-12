import { CommentModel } from "../models/comment";

export const postLike = async (req, res) => {
  const { reaction, commentId } = req.params;
  const { userId } = req;

  const comment = await CommentModel.findById(commentId);

  if (!comment) return res.status(400).json({ message: "Comment not found" });

  const targetReactionIndex = comment.reactions?.findIndex(
    (el) => el.userId == userId
  );
  if (targetReactionIndex != -1) {
    if (comment.reactions[targetReactionIndex].reaction == reaction) {
      comment.reactions?.splice(targetReactionIndex, 1);
    } else {
      comment.reactions?.splice(targetReactionIndex, 1, { userId, reaction });
    }
  } else {
    comment.reactions.push({ userId, reaction });
  }

  await comment.save();

  return res.status(200).json({ message: "Comment like success" });
};

export const patchComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const { userId } = req;

  const currentComment = await CommentModel.findById(commentId);

  if (!currentComment)
    return res.status(400).json({ message: "Comment not found" });
  if (currentComment.author != userId)
    return res.status(400).json({ message: "You are not author" });

  const newComment = await CommentModel.findByIdAndUpdate(commentId, comment, {
    new: true,
  }).populate({ path: "author" });

  return res.status(200).json({ comment: newComment });
};
