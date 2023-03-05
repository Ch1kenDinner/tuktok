import bcryptjs from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { IImageSchema } from "../archive/image";
import { IUserSchema, UserModel } from "../models/user";

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

  let user: IUserSchema;

  if (credential) {
    const googleData = await verifyToken(credential);
    if (!googleData?.email || !googleData.sub)
      return res.status(400).json({ message: "Invalid verify token response" });

    user = {
      email: googleData.email,
      sub: googleData.sub,
    };
  } else if (email && password) {
    user = {
      email,
      password: bcryptjs.hashSync(password, 12),
    };
  } else {
    return res
      .status(400)
      .json({ message: "Invalid credentials or email with password" });
  }

  let existingUser = await UserModel.findOne({ email: user.email });
  if (!existingUser) {
    existingUser = await UserModel.create(user);
    await existingUser.save();
  } else {
    if (existingUser.password) {
      const isPasswordCorrect = bcryptjs.compareSync(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid password" });
    } else if (existingUser.sub && password) {
			return res.status(400).json({message: 'Already exist google log in'})
		}
  }
  const token = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    process.env.REACT_APP_JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    token,
    user: { picture: existingUser.picture, email: existingUser.email },
  });
};
