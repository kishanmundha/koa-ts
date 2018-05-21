import * as Koa from 'koa';
import * as Mongoose from 'mongoose';

import { IPost, Post } from '../../models';
import { ValidationSchema } from '../../utils';

interface IRequestPost {
  _id?: string;
  body: string;
  title: string;
}

export const GetPostsParamsSchema = ValidationSchema({
});

export const GetPostParamsSchema = ValidationSchema({
  postId: { type: Mongoose.Types.ObjectId, required: true },
});

export const SavePostParamsSchema = ValidationSchema({
});

export const SavePostBodySchema = ValidationSchema({
  _id: { type: Mongoose.Types.ObjectId, required: false },
  body: { type: String, required: true },
  title: { type: String, required: true },
});

export const DeletePostParamsSchema = ValidationSchema({
  postId: { type: Mongoose.Types.ObjectId, required: true },
});

export const GetPosts = async (ctx: Koa.Context) => {
  const posts = await Post.find();
  ctx.body = posts;
};

export const GetPost = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;

  const post = await Post.findById(Mongoose.Types.ObjectId(postId));

  if (!post) {
    ctx.throw(404);
  }

  ctx.body = post;
};

export const SavePost = async (ctx: Koa.Context) => {
  const requestPost = ctx.request.body;

  let post: IPost;

  if (requestPost._id) {
    post = await Post.findById(Mongoose.Types.ObjectId(requestPost._id));

    if (!post) {
      ctx.throw(404);
    }

    Object.assign(post, requestPost);
  } else {
    post = new Post(requestPost);
  }

  await post.save();

  ctx.body = {
    _id: post._id,
    message: 'Post saved',
  };
};

export const DeletePost = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;

  const post = await Post.findById(Mongoose.Types.ObjectId(postId));

  if (!post) {
    ctx.throw(404);
  }

  await post.remove();

  ctx.body = {
    message: 'Post deleted',
  };
};
