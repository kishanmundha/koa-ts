import * as Koa from 'koa';
import * as Mongoose from 'mongoose';

import { IPost, Posts } from '../../models';

export const GetPosts = async (ctx: Koa.Context) => {
  const posts = await Posts.find();
  ctx.body = {
    code: 200,
    data: posts,
  };
};

export const GetPost = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;

  if (!Mongoose.Types.ObjectId.isValid(postId)) {
    ctx.throw(404);
  }

  const post = await Posts.findById(Mongoose.Types.ObjectId(postId));

  if (!post) {
    ctx.throw(404);
  }

  ctx.body = {
    code: 200,
    data: post,
  };
};

export const SavePost = async (ctx: Koa.Context) => {
  const requestPost = ctx.request.body;

  let post: IPost;

  if (requestPost._id) {
    if (!Mongoose.Types.ObjectId.isValid(requestPost._id)) {
      ctx.throw(400, 'Invalid id');
    }

    post = await Posts.findById(Mongoose.Types.ObjectId(requestPost._id));

    if (!post) {
      ctx.throw(404);
    }

    Object.assign(post, requestPost);
  } else {
    post = new Posts(requestPost);
  }

  await post.save();

  ctx.body = {
    _id: post._id,
    code: 200,
    message: 'success',
  };
};

export const DeletePost = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;

  if (!Mongoose.Types.ObjectId.isValid(postId)) {
    ctx.throw(404);
  }

  const post = await Posts.findById(Mongoose.Types.ObjectId(postId));

  if (!post) {
    ctx.throw(404);
  }

  await post.remove();

  ctx.body = {
    code: 200,
    message: 'success',
  };
};
