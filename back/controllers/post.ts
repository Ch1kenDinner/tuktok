import { Types } from "mongoose";
import { CommentModel, ICommentSchema } from "../models/comment";
import { PostModel } from "../models/post";
import { ITopicSchema, TopicModel } from "../models/topic";

export const getPosts = async (req, res) => {
  try {
    const { topics } = req.body;

    let searchTerm = {};
    if (topics) {
      searchTerm = { "topics.title": { $in: topics } };
    }

    const posts = await PostModel.find(searchTerm)
      .sort({ createdAt: -1 })
      .populate("createdBy");

    return res.json({ posts });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const getComments = async (req, res) => {
  const { postId } = req.params;

  const post = await PostModel.findById(new Types.ObjectId(postId));
	if (!post) return res.status(400).json({message: 'Post not found'})

	const comments = await CommentModel.find({_id: {$in: post?.comments}}).sort('-rating').populate({path: 'author'})

  return res.status(200).json({ comments });
};

export const postComment = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { userId } = req;

  if (!comment || !comment.text)
    return res.status(400).json({ message: "Comment not found" });

  let post = await PostModel.findById(postId).populate({
    path: "comments",
    populate: { path: "author" },
  });

  if (!post) return res.status(400).json({ message: "Post not found" });

  const commentDoc: Partial<ICommentSchema> = {
    text: comment.text,
    author: new Types.ObjectId(userId),
  };

  const newCommment = await CommentModel.create(commentDoc);
  await newCommment.save();

  post.comments.push(newCommment._id);
  await post.save();

  post = await PostModel.findById(postId).populate({
    path: "comments",
    populate: { path: "author" },
  });

  return res.status(200).json({ comments: post?.comments });
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

export const deletePost = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(new Types.ObjectId(postId));

    if (post && post?.createdBy == userId) {
      post.delete();
    } else {
      res
        .status(400)
        .json({ message: "Post or author not found " + post?.createdBy });
    }
    res.status(200).json({ message: "Post deleted" });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
