import { model, Schema, Types } from "mongoose";
import { ITopicSchema, topicSchema } from "./topic";
import { IUserSchema } from "./user";

export interface IPostSchema {
  title: string;
  videoId?: Types.ObjectId;
  createdBy?: Types.ObjectId | IUserSchema;
  createdAt: Date;
  updatedAt: Date;
  topics: ITopicSchema[];
}

const postSchema = new Schema<IPostSchema>({
  title: {
    type: String,
    required: true,
  },
  videoId: {
    type: Types.ObjectId,
    ref: "mainVideoBucket",
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
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
  topics: {
    type: [topicSchema],
  },
});

postSchema.post("save", function () {
  this.updatedAt = new Date(Date.now());
});

export const PostModel = model<IPostSchema>("post", postSchema);
