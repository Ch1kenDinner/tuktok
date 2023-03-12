import { model, Schema, Types } from "mongoose";

export interface ICommentSchema {
  author: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  reactions: {
    reaction: string;
    userId: Types.ObjectId;
  }[];
}

export const commentSchema = new Schema<ICommentSchema>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  reactions: {
    type: [
      {
        reaction: String,
        userId: Types.ObjectId,
      },
    ],
    default: [],
  },
});

commentSchema.pre("save", function () {
  this.updatedAt = new Date(Date.now());

  let likesCount = 0;
  let dislikesCount = 0;
  this.reactions.forEach((el) => {
    if (el.reaction == "like") {
      likesCount += 1;
    } else if (el.reaction == "dislike") {
      dislikesCount += 1;
    }
  });
  this.rating = likesCount - dislikesCount;
});

export const CommentModel = model<ICommentSchema>("comment", commentSchema);
