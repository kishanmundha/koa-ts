import { expect } from 'chai';
import 'mocha';
import { proxy } from 'proxyrequire';

import { callKoaFunction, MockContext } from '../../helpers';
// import posts from '../../mock-data/posts.json';

describe('PostController', () => {
  describe('GetPosts', () => {
    it('Should return array with status 200', async () => {
      const getPosts = proxy(() => require('../../../src/api/controllers/post').GetPosts, {
        '../../models': { Posts: { find: () => Promise.resolve([]) } },
      });

      const ctx = new MockContext({
      });

      await callKoaFunction(ctx, getPosts);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.data).to.deep.equal([]);
    });
  });

  describe('GetPost', () => {
    it('Should return 404 for invalid postId', async () => {
      const getPost = proxy(() => require('../../../src/api/controllers/post').GetPost, {
        '../../models': {},
      });

      const ctx = new MockContext({
        params: {
          postId: '123',
        },
      });

      await callKoaFunction(ctx, getPost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 404 for invalid not found post', async () => {
      const getPost = proxy(() => require('../../../src/api/controllers/post').GetPost, {
        '../../models': { Posts: { findById: () => Promise.resolve(null) } },
      });

      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, getPost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return post with status code 200', async () => {
      const getPost = proxy(() => require('../../../src/api/controllers/post').GetPost, {
        '../../models': { Posts: { findById: () => Promise.resolve({}) } },
      });

      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, getPost);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.data).to.deep.equal({});
    });
  });

  describe('SavePost', () => {
    it('Should return 400 for invalid request', async () => {
      const savePost = proxy(() => require('../../../src/api/controllers/post').SavePost, {
        '../../models': {},
      });

      const ctx = new MockContext({
        body: {
          _id: '1234',
        },
      });

      await callKoaFunction(ctx, savePost);

      expect(ctx.status).to.equal(400);
    });

    it('Should return 404 for update with not found post', async () => {
      const savePost = proxy(() => require('../../../src/api/controllers/post').SavePost, {
        '../../models': { Posts: { findById: () => Promise.resolve(null) } },
      });

      const ctx = new MockContext({
        body: {
          _id: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, savePost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 200 for update post', async () => {
      function Posts() {/**/}

      (Posts as any).findById = () => Promise.resolve(new Posts());
      Posts.prototype.save = () => null;

      const savePost = proxy(() => require('../../../src/api/controllers/post').SavePost, {
        '../../models': { Posts },
      });

      const ctx = new MockContext({
        body: {
          _id: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, savePost);

      expect(ctx.status).to.equal(200);
    });

    it('Should return 200 for new post', async () => {
      function Posts() {/**/}

      (Posts as any).findById = () => Promise.resolve(new Posts());
      Posts.prototype.save = () => null;

      const savePost = proxy(() => require('../../../src/api/controllers/post').SavePost, {
        '../../models': { Posts },
      });

      const ctx = new MockContext({
        body: {
        },
      });

      await callKoaFunction(ctx, savePost);

      expect(ctx.status).to.equal(200);
    });
  });

  describe('DeletePost', () => {
    it('Should return 404 for invalid postId', async () => {
      const deletePost = proxy(() => require('../../../src/api/controllers/post').DeletePost, {
        '../../models': { Posts: { findById: () => Promise.resolve(null) } },
      });

      const ctx = new MockContext({
        params: {
          postId: '1234',
        },
      });

      await callKoaFunction(ctx, deletePost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 404 for not found post', async () => {
      const deletePost = proxy(() => require('../../../src/api/controllers/post').DeletePost, {
        '../../models': { Posts: { findById: () => Promise.resolve(null) } },
      });

      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, deletePost);

      expect(ctx.status).to.equal(404);
    });

    it('Should return 200 for success delete post', async () => {
      function Posts() {/**/}

      (Posts as any).findById = () => Promise.resolve(new Posts());
      Posts.prototype.remove = () => null;

      const deletePost = proxy(() => require('../../../src/api/controllers/post').DeletePost, {
        '../../models': { Posts },
      });

      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, deletePost);

      expect(ctx.status).to.equal(200);
    });
  });
});
