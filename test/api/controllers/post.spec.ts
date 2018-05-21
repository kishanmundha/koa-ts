import { expect } from 'chai';
import 'mocha';
import * as Mongoose from 'mongoose';
import { proxy } from 'proxyrequire';

import { callKoaFunction, MockContext, MockModel } from '../../helpers';

const posts = [{
  _id: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
  body: 'test body',
  title: 'test',
  user: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
}];

const Post = MockModel(posts);

const PostController = proxy(() => require('../../../src/api/controllers/post'), {
  '../../models': { Post },
});

describe('PostController', () => {
  describe('GetPosts', () => {
    const { GetPosts } = PostController;
    it('Should return array with status 200', async () => {
      const ctx = new MockContext({
      });

      await callKoaFunction(ctx, GetPosts);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.length).to.equal(1);
    });
  });

  describe('GetPost', () => {
    const { GetPost } = PostController;

    it('Should return 404 for not found post', async () => {
      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234568',
        },
      });

      await callKoaFunction(ctx, GetPost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return post with status code 200', async () => {
      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, GetPost);

      expect(ctx.status).to.equal(200);
    });
  });

  describe('SavePost', () => {
    const { SavePost } = PostController;
    it('Should return 404 for update with not found post', async () => {
      const ctx = new MockContext({
        body: {
          _id: '0123456789abcdef01234568',
        },
      });

      await callKoaFunction(ctx, SavePost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 200 for update post', async () => {
      const ctx = new MockContext({
        body: {
          _id: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, SavePost);

      expect(ctx.status).to.equal(200);
    });

    it('Should return 200 for new post', async () => {
      const ctx = new MockContext({
        body: {
        },
      });

      await callKoaFunction(ctx, SavePost);

      expect(ctx.status).to.equal(200);
    });
  });

  describe('DeletePost', () => {
    const { DeletePost } = PostController;
    it('Should return 404 for not found post', async () => {
      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234568',
        },
      });

      await callKoaFunction(ctx, DeletePost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 200 for success delete post', async () => {
      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, DeletePost);

      expect(ctx.status).to.equal(200);
    });
  });
});
