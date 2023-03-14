import { IUserSchema, UserModel } from "../models/user";

export const patchUser = async (req, res) => {
  try {
    const { picture, username } = req.body;

    let updateFields: Partial<IUserSchema> = {};
    if (username) {
      updateFields.username = username;
    }
    if (picture) {
      updateFields.picture = picture;
    }

    const user = await UserModel.findByIdAndUpdate(req.userId, updateFields, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({
      user: {
        _id: user._id,
        email: user.email,
        picture: user.picture,
        username: user.username,
      },
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(400).json({ message: err });
  }
};
