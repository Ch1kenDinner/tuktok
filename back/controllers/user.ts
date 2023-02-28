import { UserModel } from "../models/user"


export const postAvatar = async (req, res) => {
	try {
		const {userId} = req
		const { base64 } = req.body;

		const user = await UserModel.findByIdAndUpdate(req.userId, {picture: base64}, {new: true});
		if (!user) return res.status(404).json({message: 'User not found'})
		return res.json({user: {picture: user.picture, email: user.email}})
	} catch(err: any) {
		console.log(err.message);
		return res.status(400).json({message: err})
	}
}