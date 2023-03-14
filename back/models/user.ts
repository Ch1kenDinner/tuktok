import { model, Schema, Types } from "mongoose";
import { defaultAvatarBase64 } from "../common/const";

export interface IUserSchema {
  email: string;
	username?: string,
  password?: string;
  picture?: string;
  sub?: string;
	likePosts?: Types.ObjectId[]
}


export const userSchema = new Schema<IUserSchema>({
  email: {
    type: String,
    require: true,
  },
	username: {
		type: String,
		default: function() {return (this as any).email } 
	},
  password: {
    type: String,
  },
  picture: {
    type: String,
    default: defaultAvatarBase64,
  },
  sub: {
    type: String,
  },
	likePosts: {
		type: [Types.ObjectId],
	}
});

export const UserModel = model<IUserSchema>("user", userSchema);
