import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
	const {token} = req.headers
	try {
		const user = jwt.verify(token, process.env.REACT_APP_JWT_SECRET!) as any
		req.userId = user.id
		next()
	} catch(err) {
		return res.status(401).json({message: 'Not authorized'})
	}
}

export const passUserId = async (req, res, next) => {
	const {token} = req.headers
	try {
		if (token) {
			const user = jwt.verify(token, process.env.REACT_APP_JWT_SECRET!) as any;
			req.userId = user.id;
		}
	} catch(err) {
		console.log(err);
	} finally {
		next();
	}
}