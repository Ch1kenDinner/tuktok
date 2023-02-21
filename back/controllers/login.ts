import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { IUserModel, UserModel } from "../models/user";
import bcryptjs from 'bcryptjs'

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const verifyToken = async (token) => {
  try {
    return (
      await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      })
    ).getPayload();
  } catch (err) {
    throw new Error("verify token error");
  }
};

export const postLogin = async (req, res) => {
  const { credential, email, password } = req.body;

  let user: IUserModel;
  if (credential) {
    const googleData = await verifyToken(credential);
    if (!googleData?.email || !googleData.sub)
      return res.status(400).json({ message: "Invalid verify token response" });
    user = {
      email: googleData.email,
      sub: googleData.sub,
      icon: googleData.picture,
    };
  } else if (email && password) {
    user = {
      email,
      password: bcryptjs.hashSync(password, 12)
    };
  } else {
    return res
      .status(400)
      .json({ message: "Invalid credentials or email with password" });
  }

  const currentUser = await UserModel.findOne({ email: user.email });
  if (!currentUser) {
    const currentUser = await UserModel.create(user);
    currentUser.save();
  }
  if (currentUser) {
		if (currentUser.password) {
			const isPasswordCorrect = bcryptjs.compareSync(password, currentUser.password)
			if (!isPasswordCorrect) return res.status(400).json({message: 'Invalid password'})
		}
    const token = jwt.sign(
      { email: currentUser.email, id: currentUser._id },
      process.env.REACT_APP_JWT_SECRET!,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      token,
      user: { icon: currentUser.icon, email: currentUser.email },
    });
  }
};
