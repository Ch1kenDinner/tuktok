import { topicModel } from "../models/topic"

export const getTopics = async (req, res) => {
	const topics = await topicModel.find({})
	return res.json({topics})
}