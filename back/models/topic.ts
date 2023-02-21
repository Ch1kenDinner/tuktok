import { Schema, model } from "mongoose";

interface ITopicSchema {
	title: string
}

const topicSchema = new Schema<ITopicSchema>({
	title: {
		type: String,
		required: true
	}
})

export const topicModel = model('topic', topicSchema)