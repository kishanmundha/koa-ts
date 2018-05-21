import { expect } from 'chai';
import 'mocha';
import * as Mongoose from 'mongoose';
import { proxy } from 'proxyrequire';

import { callKoaFunction, MockContext, MockModel } from '../../helpers';

const comments = [{
  _id: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
  comment: 'test',
  post: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
}];

const Comment = MockModel(comments);

const CommentController = proxy(() => require('../../../src/api/controllers/comment'), {
  '../../models': { Comment },
});

describe('CommentController', () => {
  describe('GetComments', () => {
    const { GetComments } = CommentController;

    it('Should return array with status 200', async () => {
      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, GetComments);
      expect(ctx.body.length).to.equal(1);

      ctx.params.postId = '0123456789abcdef01234568';

      await callKoaFunction(ctx, GetComments);
      expect(ctx.body.length).to.equal(0);
    });
    it('Should return array with status 200', async () => {
      const ctx = new MockContext({});

      await callKoaFunction(ctx, GetComments);
    });
  });

  describe('GetComment', () => {
    const { GetComment } = CommentController;

    it('Should return 404 for not found comment', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '0123456789abcdef01234568',
          postId: '0123456789abcdef01234568',
        },
      });

      await callKoaFunction(ctx, GetComment);

      expect(ctx.status).to.equal(404);
    });

    it('Should return comment with status code 200', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '0123456789abcdef01234567',
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, GetComment);

      expect(ctx.status).to.equal(200);
      expect(Mongoose.Types.ObjectId('0123456789abcdef01234567').equals(ctx.body._id)).to.equal(true);
    });
  });

  describe('SaveComment', () => {
    const { SaveComment } = CommentController;

    it('Should return 404 for update with not found post', async () => {
      const ctx = new MockContext({
        body: {
          _id: '0123456789abcdef01234568',
        },
        params: {
          postId: '0123456789abcdef01234568',
        },
      });

      await callKoaFunction(ctx, SaveComment);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 200 for update post', async () => {
      const ctx = new MockContext({
        body: {
          _id: '0123456789abcdef01234567',
        },
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, SaveComment);

      expect(ctx.status).to.equal(200);
    });

    it('Should return 200 for new post', async () => {
      const ctx = new MockContext({
        body: {
        },
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, SaveComment);

      expect(ctx.status).to.equal(200);
    });
  });

  describe('DeleteComment', () => {
    const { DeleteComment } = CommentController;

    it('Should return 404 for not found comment', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '0123456789abcdef01234568',
          postId: '0123456789abcdef01234568',
        },
      });

      await callKoaFunction(ctx, DeleteComment);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 200 for success delete comment', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '0123456789abcdef01234567',
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, DeleteComment);

      expect(ctx.status).to.equal(200);
    });
  });
});

/*
describe('PostController', () => {

});
*/
