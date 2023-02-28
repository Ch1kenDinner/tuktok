import { TopicModel } from "../models/topic"

export const getTopics = async (req, res) => {
	const topics = await TopicModel.find({}, {title: 1, icon: 1})
	return res.json({topics})
}