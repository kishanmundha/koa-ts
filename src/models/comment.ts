import * as Mongoose from 'mongoose';

import { IPost } from './post';
import { IUser } from './user';

const CommentSchema = new Mongoose.Schema({
  comment: { type: Mongoose.Schema.Types.String, required: true, maxlength: 100, minlength: 1 },
  post: { type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'posts' },
  user: { type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
});

interface IComment extends Mongoose.Document {
  comment: Mongoose.Schema.Types.String;
  post: Mongoose.Schema.Types.ObjectId | IPost;
  user: Mongoose.Schema.Types.ObjectId | IUser;
}

const Comment = Mongoose.model<IComment>('comments', CommentSchema, 'comments');

export {
  IComment,
  Comment,
};
