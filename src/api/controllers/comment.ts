import * as Koa from 'koa';
import * as Mongoose from 'mongoose';

import { Comments, IComment } from '../../models';

export const GetComments = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;

  if (!Mongoose.Types.ObjectId.isValid(postId)) {
    ctx.throw(404);
  }

  const comments = await Comments.find({ post: Mongoose.Types.ObjectId(postId) });

  ctx.body = {
    code: 200,
    data: comments,
  };
};

export const GetComment = async (ctx: Koa.Context) => {
  const { postId, commentId } = ctx.params;

  if (!Mongoose.Types.ObjectId.isValid(postId) ||
      !Mongoose.Types.ObjectId.isValid(commentId)
  ) {
    ctx.throw(404);
  }

  const comment = await Comments.findOne({
    _id: Mongoose.Types.ObjectId(commentId),
    post: Mongoose.Types.ObjectId(postId),
  });

  if (!comment) {
    ctx.throw(404);
  }

  ctx.body = {
    code: 200,
    data: comment,
  };
};

export const SaveComment = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;
  const requestPost = ctx.request.body;

  let comment: IComment;

  if (!Mongoose.Types.ObjectId.isValid(postId)) {
    ctx.throw(404);
  }

  if (requestPost._id) {
    if (!Mongoose.Types.ObjectId.isValid(requestPost._id)) {
      ctx.throw(400, 'Invalid id');
    }

    comment = await Comments.findOne({
      _id: Mongoose.Types.ObjectId(requestPost._id),
      post: Mongoose.Types.ObjectId(postId),
    });

    if (!comment) {
      ctx.throw(404);
    }

    Object.assign(comment, requestPost);
  } else {
    comment = new Comments(Object.assign({}, requestPost, { post: Mongoose.Types.ObjectId(postId) }));
  }

  await comment.save();

  ctx.body = {
    _id: comment._id,
    code: 200,
    message: 'success',
  };
};

export const DeleteComment = async (ctx: Koa.Context) => {
  const { postId, commentId } = ctx.params;

  if (!Mongoose.Types.ObjectId.isValid(postId) &&
      !Mongoose.Types.ObjectId.isValid(commentId)
  ) {
    ctx.throw(404);
  }

  const comment = await Comments.findById(Mongoose.Types.ObjectId(commentId));

  if (!comment) {
    ctx.throw(404);
  }
  if (!Mongoose.Types.ObjectId(postId).equals(comment.post as any)) {
    ctx.throw(404);
  }

  await comment.remove();

  ctx.body = {
    code: 200,
    message: 'success',
  };
};
