export interface IPost {
  _id: string;
  title: string;
  videoId: string;
  createdBy: { picture?: string; email: string; _id: string };
  topics: { title: string; icon?: string }[];
	comments: IComment[],
  createdAt: Date;
}

export interface IComment {
  _id: string;
  author: IUser;
  text: string;
  createdAt: Date;
  updatedAt: Date;
	rating: number,
	reactions: {userId: string, reaction: string}[]
}

export interface IUser {
	_id: string,
  picture: string;
  email: string;
}
