import { model, Schema } from "mongoose"


export interface IImageSchema {
	base64?: string,
	url?: string,
	title?: string
}

export const imageSchema = new Schema<IImageSchema>({
	base64: String,
	url: String,
	title: String
})

export const ImageModel = model<IImageSchema>('Image', imageSchema)