import * as Koa from 'koa';
import * as Mongoose from 'mongoose';

import { Comment, IComment } from '../../models';
import { ValidationSchema } from '../../utils';

interface IRequestComment {
  _id?: string;
  post: string;
  comment: string;
}

export const GetCommentsParamsSchema = ValidationSchema({
  postId: { type: Mongoose.Types.ObjectId, required: true },
});

export const GetCommentParamsSchema = ValidationSchema({
  commentId: { type: Mongoose.Types.ObjectId, required: true },
  postId: { type: Mongoose.Types.ObjectId, required: true },
});

export const SaveCommentParamsSchema = ValidationSchema({
  postId: { type: Mongoose.Types.ObjectId, required: true },
});

export const SaveCommentBodySchema = ValidationSchema({
  _id: { type: Mongoose.Types.ObjectId, required: false },
  comment: { type: String, required: true, maxLength: 100, minLength: 1 },
  post: { type: Mongoose.Types.ObjectId, required: true },
  user: { type: Mongoose.Types.ObjectId, required: true },
});

export const DeleteCommentParamsSchema = ValidationSchema({
  commentId: { type: Mongoose.Types.ObjectId, required: true },
  postId: { type: Mongoose.Types.ObjectId, required: true },
});

export const GetComments = async (ctx: Koa.Context) => {
  const { postId } = ctx.params;

  if (!Mongoose.Types.ObjectId.isValid(postId)) {
    ctx.throw(400);
  }

  const comments = await Comment.find({ post: Mongoose.Types.ObjectId(postId) });

  ctx.body = comments;
};

export const GetComment = async (ctx: Koa.Context) => {
  const { postId, commentId } = ctx.params;

  const comment = await Comment.findById(Mongoose.Types.ObjectId(commentId));

  if (!comment) {
    ctx.throw(404);
  }

  ctx.body = comment;
};

export const SaveComment = async (ctx: Koa.Context) => {
  const requestPost = ctx.request.body as IRequestComment;

  let comment: IComment;

  if (requestPost._id) {
    comment = await Comment.findById(Mongoose.Types.ObjectId(requestPost._id));

    if (!comment) {
      ctx.throw(404);
    }

    Object.assign(comment, requestPost);
  } else {
    comment = new Comment(Object.assign({}, requestPost));
  }

  await comment.save();

  ctx.body = {
    _id: comment._id,
    message: 'Comment saved',
  };
};

export const DeleteComment = async (ctx: Koa.Context) => {
  const { postId, commentId } = ctx.params;

  const comment = await Comment.findById(Mongoose.Types.ObjectId(commentId));

  if (!comment) {
    ctx.throw(404);
  }

  await comment.remove();

  ctx.body = {
    message: 'Comment deleted',
  };
};
