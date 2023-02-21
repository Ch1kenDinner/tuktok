import { model, Schema } from "mongoose";


export interface IUserModel {
	email: string,
	password?: string,
	icon?: string,
	sub?: string
}

const userSchema = new Schema<IUserModel>({
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
	},
	icon: {
		type: String
	},
	sub: {
		type: String
	}
})

export const UserModel = model<IUserModel>('user', userSchema)