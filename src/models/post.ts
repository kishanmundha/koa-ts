import * as Mongoose from 'mongoose';

import { IUser } from './user';

const PostSchema = new Mongoose.Schema({
  body: { type: String, required: true },
  title: { type: String, required: true },
  user: { type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
});

interface IPost extends Mongoose.Document {
  body: string;
  title: string;
  user: Mongoose.Schema.Types.ObjectId | IUser;
}

const Post = Mongoose.model<IPost>('posts', PostSchema, 'posts');

export {
  IPost,
  Post,
};
