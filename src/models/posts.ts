import * as Mongoose from 'mongoose';

const PostSchema = new Mongoose.Schema({
  body: { type: String, required: true },
  title: { type: String, required: true },
});

interface IPost extends Mongoose.Document {
  body: string;
  title: string;
}

const Posts = Mongoose.model<IPost>('posts', PostSchema, 'posts');

export {
  IPost,
  Posts,
};
