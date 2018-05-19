import { expect } from 'chai';
import 'mocha';
import * as Mongoose from 'mongoose';
import { proxy } from 'proxyrequire';

import { callKoaFunction, MockContext } from '../../helpers';

const comments = [{
  _id: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
  message: 'test',
  post: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
  title: 'test',
}];

function Comment(document) {
  this.document = document;

  if (document) {
    Object.keys(document).forEach((key) => {
      this[key] = document[key];
    });
  }
}

Comment.prototype.save = async () => {
  // comments.push(this.document);
};

Comment.prototype.remove = async () => {
  // comments.push(this.document);
};

(Comment as any).find = async (condition) => {
  if (!condition || Object.keys(condition).length === 0) {
    return comments;
  }

  return comments.filter((x) => {
    return Object.keys(condition).every((key) => {
      if (x[key] instanceof Mongoose.Types.ObjectId) {
        return (x[key] as Mongoose.Types.ObjectId).equals(condition[key]);
      }

      return condition[key] === x[key];
    });
  }).map((x) => new Comment(x));
};

(Comment as any).findOne = async (condition) => {
  const result = await (Comment as any).find(condition);
  return result[0] || null;
};

(Comment as any).findById = async (id) => {
  const record = comments.find((x) => x._id.equals(id));

  if (record) {
    return new Comment(record);
  }

  return null;
};

describe('CommentController', () => {
  describe('GetComments', () => {
    const GetComments = proxy(() => require('../../../src/api/controllers/comment').GetComments, {
      '../../models': { Comments: Comment },
    });

    it('Should return array with status 200', async () => {
      const ctx = new MockContext({
        params: {
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, GetComments);
    });
    it('Should return array with status 200', async () => {
      const ctx = new MockContext({});

      await callKoaFunction(ctx, GetComments);
    });
  });

  describe('GetComment', () => {
    let GetComment;

    beforeEach(async () => {
      GetComment = proxy(() => require('../../../src/api/controllers/comment').GetComment, {
        '../../models': { Comments: Comment },
      });
    });

    it('Should return 404 for invalid postId', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '123',
          postId: '123',
        },
      });

      await callKoaFunction(ctx, GetComment);
    });
    it('Should return 404 for invalid postId', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '123',
          postId: '0123456789abcdef01234567',
        },
      });

      await callKoaFunction(ctx, GetComment);
    });

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
    });
  });

  describe('SaveComment', () => {
    const SaveComment = proxy(() => require('../../../src/api/controllers/comment').SaveComment, {
      '../../models': { Comments: Comment },
    });

    it('Should return 400 for invalid request', async () => {
      const ctx = new MockContext({
        body: {
          _id: '1234',
        },
        params: {
          postId: '1234',
        },
      });

      await callKoaFunction(ctx, SaveComment);

      expect(ctx.status).to.equal(404);
    });

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
    const DeleteComment = proxy(() => require('../../../src/api/controllers/comment').DeleteComment, {
      '../../models': { Comments: Comment },
    });

    it('Should return 404 for invalid comment', async () => {
      const ctx = new MockContext({
        params: {
          commentId: '1234',
          postId: '1234',
        },
      });

      await callKoaFunction(ctx, DeleteComment);

      expect(ctx.status).to.equal(404);
    });

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
