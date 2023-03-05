import { Types } from "mongoose";
import { PostModel } from "../models/post";
import { ITopicSchema, TopicModel } from "../models/topic";
import { IUserSchema } from "../models/user";

export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy");

    if (!posts.length) return res.json({ message: "Posts not found" });

    return res.json({
      videos: posts.map((el) => ({
        title: el.title,
        videoId: el.videoId,
        topics: el.topics,
        createdBy: {
          email: (el.createdBy as IUserSchema).email,
          picture: (el.createdBy as IUserSchema).picture,
        },
      })),
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const postVideo = async (req, res) => {
  try {
    const { userId, videoId } = req;
    const { title, topics } = req.body;

    console.log("topics", topics);

    const topicsTitle = topics.map((el: ITopicSchema) =>
      el.title.toLowerCase()
    );
    const existingTopics = await TopicModel.find(
      {
        title: { $in: topicsTitle },
      },
      ["title", "icon"]
    );

    const topicDocs = await Promise.all(
      topics.map(async (topic: ITopicSchema) => {
        const existingTopic = existingTopics.find(
          (el) => el.title == topic.title.toLowerCase()
        );
        if (existingTopic) {
          return existingTopic;
        } else {
          const newTopic = await TopicModel.create(topic);
          newTopic.save();
          return newTopic;
        }
      })
    );

    const post = {
      title,
      topics: topicDocs,
      videoId,
      createdBy: new Types.ObjectId(userId),
    };

    const postDoc = await PostModel.create(post);
    await postDoc.save();

    return res.status(200).json({ message: "Video upload success" });
  } catch (err) {
    res.json({ message: err });
  }
};

export const getPostsByTopics = async (req, res) => {
	try {
		const { topics } = req.body;

		const posts = await PostModel.find(
      { "topics.title": { $in: topics } },
      { title: 1, createdBy: 1, topics: 1, videoId: 1 }
    ).sort('-createdAt').populate('createdBy');

		res.json({ posts });
	} catch({message}: any) {
		console.log(message);
		res.status(400).json({message})
	}
};
