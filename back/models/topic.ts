import { Schema, model } from "mongoose";

export interface ITopicSchema {
	title: string,
	icon?: string
}

export const topicSchema = new Schema<ITopicSchema>({
	title: {
		type: String,
		required: true,
		lowercase: true
	},
	icon: {
		type: String
	}
})

export const TopicModel = model('topic', topicSchema)