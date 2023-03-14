import { model, Schema, Types } from "mongoose";
import { ITopicSchema, topicSchema } from "./topic";
import { IUserSchema } from "./user";

export interface IPostSchema {
  title: string;
  videoId?: Types.ObjectId;
  createdBy?: Types.ObjectId | IUserSchema;
  createdAt: Date;
  updatedAt: Date;
	comments: Types.ObjectId[]
  topics: ITopicSchema[];
	likes?: number
}

const postSchema = new Schema<IPostSchema>({
  title: {
    type: String,
    required: true,
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: "mainVideoBucket",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
	comments: {
		type: [Schema.Types.ObjectId],
		ref: 'comment'
	},
  topics: {
    type: [topicSchema],
  },
	likes: {
		type: Number,
		default: 0,
		min: 0
	}
});

postSchema.post("save", function () {
  this.updatedAt = new Date(Date.now());
});

export const PostModel = model<IPostSchema>("post", postSchema);
