
export const calcLikeColor = (likesCount: number) => {
	if (likesCount === 0) {
		return;
	} else if (likesCount > 0) {
		return "green"
	} else {
		return 'red'
	}
}