import { IComment } from "./types";

export const calcLikeColor = (likesCount: number) => {
	if (likesCount === 0) {
		return;
	} else if (likesCount > 0) {
		return "green"
	} else {
		return 'red'
	}
}

export const returnUpdatedComments = (comments: IComment[], commentId: string, newComment: IComment) => {
	const targetCommentIndex = comments.findIndex((el) => el._id == commentId)
	const newComments = comments.slice()
	newComments.splice(targetCommentIndex, 1, newComment)
	return newComments
}