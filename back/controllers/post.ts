import archiver from "archiver";
import mongoose, { Types } from "mongoose";
import { mainVideoBucket } from "..";
import { PostModel } from "../models/post";
import { ITopicSchema, TopicModel } from "../models/topic";
import { IUserSchema } from "../models/user";

export const getVideo = async (req, res) => {
  const { videoId } = req.params;

  const videos = await mainVideoBucket
    .find({ _id: new mongoose.Types.ObjectId(videoId) })
    .toArray();
  if (videos.length == 0)
    return res.status(404).json({ message: "Video not found!" });

  res.set("Content-Type", videos[0].contentType);
  res.set("Content-Disposition", `attachment; filename=${videos[0].filename}`);

  const fileStream = mainVideoBucket.openDownloadStream(
    new mongoose.Types.ObjectId(videoId)
  );
  fileStream.pipe(res);
};

export const getVideos = async (req, res) => {
  const videos: any[] = await mainVideoBucket.find().toArray();
  if (videos.length == 0) return res.json({ message: "Videos not found!" });

  res.set("Content-Type", videos[0].contentType);
  res.set("Content-Disposition", `attachment; filename=${videos[0].filename}`);

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(res);
  videos.forEach((file) => {
    const fileStream = mainVideoBucket.openDownloadStream(
      new mongoose.Types.ObjectId(file._id)
    );
    archive.append(fileStream, { name: file.filename });
  });

  archive.finalize();
};

export const getPostsPreview = async (req, res) => {
  try {
    const posts = await PostModel.find({}).populate("createdBy");

    if (!posts.length)
      return res.json({ message: "Posts not found" });

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

    const topicsTitle = topics.map((el: ITopicSchema) =>
      el.title.toLowerCase()
    );
    const existingTopics = await TopicModel.find(
      {
        title: { $in: topicsTitle },
      },
      ["title", "icon"]
    );

    const topicDocs = await Promise.all(topics.map(async (topic: ITopicSchema) => {
      const existingTopic = existingTopics.find(
        (el) => el.title == topic.title.toLowerCase()
      );
      if (existingTopic) {
        return existingTopic;
      } else {
				const newTopic = await TopicModel.create(topic)
				newTopic.save()
				return newTopic
			}
    }));

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
