import * as Mongoose from 'mongoose';

import { IPost } from './posts';
import { IUser } from './users';

const CommentSchema = new Mongoose.Schema({
  body: { type: Mongoose.Schema.Types.String, required: true },
  post: { type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'posts' },
  title: { type: Mongoose.Schema.Types.String, required: true },
  user: { type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
});

interface IComment extends Mongoose.Document {
  post: Mongoose.Schema.Types.ObjectId | IPost;
  user: Mongoose.Schema.Types.ObjectId | IUser;
}

const Comments = Mongoose.model<IComment>('comments', CommentSchema, 'comments');

export {
  IComment,
  Comments,
};
