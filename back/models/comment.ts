import { model, Schema, Types } from "mongoose";

export interface ICommentSchema {
	author: Types.ObjectId,
	text: string,
	createdAt: Date,
	updatedAt: Date,
	reactions: {
		reaction: string,
		userId: Types.ObjectId
	}[]
	// likes?: Types.ObjectId[],
	// dislikes?: Types.ObjectId[]
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
      }
    ],
		default: []
  },
  // likes: {
  //   type: [Schema.Types.ObjectId],
  // 	default: [],
  //   ref: "user",
  // },
  // dislikes: {
  //   type: [Schema.Types.ObjectId],
  // 	default: [],
  //   ref: "user",
  // },
});

commentSchema.post('save', function() {
	this.updatedAt = new Date(Date.now())
})

export const CommentModel = model<ICommentSchema>('comment', commentSchema)

