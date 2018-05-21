import { expect } from 'chai';
import 'mocha';
import * as Mongoose from 'mongoose';
import { proxy } from 'proxyrequire';

import * as jwt from 'jsonwebtoken';

import { callKoaFunction, MockContext, MockModel } from '../../helpers';

const users = [{
  _id: Mongoose.Types.ObjectId('0123456789abcdef01234567'),
  password: 'test',
  username: 'test',
}];

const User = MockModel(users);

const AuthController = proxy(() => require('../../../src/api/controllers/auth'), {
  '../../models': { User },
});

describe('Auth controller', () => {
  describe('login', () => {
    const { login } = AuthController;

    it('Should throw 400 if username empty', async () => {
      const ctx = new MockContext({
        body: {
          password: '1234',
          username: '',
        },
      });

      await callKoaFunction(ctx, login);
      expect(ctx.status).to.equal(400);
    });

    it('Should throw 400 if password empty', async () => {
      const ctx = new MockContext({
        body: {
          password: '',
          username: 'test',
        },
      });

      await callKoaFunction(ctx, login);
      expect(ctx.status).to.equal(400);
    });

    it('Should return code 200 with body status 401 for invalid username or password', async () => {
      const ctx = new MockContext({
        body: {
          password: '1234',
          username: '1234',
        },
      });

      await callKoaFunction(ctx, login);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.code).to.equal(401);
      expect(ctx.body.success).to.equal(false);
    });

    it('Should return jwt token for valid username and password', async () => {
      const ctx = new MockContext({
        body: {
          password: 'test',
          username: 'test',
        },
      });

      await callKoaFunction(ctx, login);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.code).to.equal(200);
      expect(ctx.body.success).to.equal(true);
      expect(ctx.body.data.token).to.be.a('string');
    });
  });

  describe('signup', () => {
    const { signup } = AuthController;

    it('Should reject request for duplicate username', async () => {
      const ctx = new MockContext({
        body: {
          username: 'test',
        },
      });

      await callKoaFunction(ctx, signup);

      expect(ctx.status).to.equal(400);
    });

    it('Should return ok response for valid request', async () => {
      const ctx = new MockContext({
        body: {
          username: '1234',
        },
      });

      await callKoaFunction(ctx, signup);

      expect(ctx.status).to.equal(200);
    });
  });
});
