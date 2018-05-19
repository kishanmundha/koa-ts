import { expect } from 'chai';
import 'mocha';
// import * as ProxyRequire from 'proxyrequire';
import { proxy } from 'proxyrequire';

import * as jwt from 'jsonwebtoken';

import { callKoaFunction, context, MockContext } from '../../helpers';

import * as AuthController from '../../../src/api/controllers/auth';

describe('Auth controller', () => {
  describe('login', () => {
    it('Should throw 400 if username empty', async () => {
      const ctx: any = context({
        body: {
          password: '1234',
          username: '',
        },
      }, null);

      try {
        await AuthController.login(ctx);
      } catch (e) {
        expect(e.status).to.equal(400);
      }

      expect(ctx.status).to.equal(400);
    });

    it('Should throw 400 if password empty', async () => {
      const ctx: any = context({
        body: {
          password: '',
          username: 'test',
        },
      }, null);

      try {
        await AuthController.login(ctx);
      } catch (e) {
        expect(e.status).to.equal(400);
      }

      expect(ctx.status).to.equal(400);
    });

    it('Should return code 200 with body status 401 for invalid username or password', async () => {
      const ctx = new MockContext({
        body: {
          password: '1234',
          username: '1234',
        },
      });

      const login = proxy(() => require('../../../src/api/controllers/auth').login, {
        '../../models': { Users: { find: () => Promise.resolve(null) } },
      });

      await callKoaFunction(ctx, login);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.code).to.equal(401);
      expect(ctx.body.success).to.equal(false);
    });

    it('Should return jwt token for valid username and password', async () => {
      const ctx = new MockContext({
        body: {
          password: '1234',
          username: '1234',
        },
      });

      const login = proxy(() => require('../../../src/api/controllers/auth').login, {
        '../../models': { Users: { find: () => ({ username: '1234' }) } },
      });

      await callKoaFunction(ctx, login);

      expect(ctx.status).to.equal(200);
      expect(ctx.body.code).to.equal(200);
      expect(ctx.body.success).to.equal(true);
      expect(ctx.body.data.token).to.be.a('string');
    });
  });

  describe('signup', () => {
    it('Should reject request for duplicate username', async () => {
      const signup = proxy(() => require('../../../src/api/controllers/auth').signup, {
        '../../models': { Users: { find: () => ({ username: '1234' }) } },
      });

      const ctx = new MockContext({
        body: {},
      });

      await callKoaFunction(ctx, signup);

      expect(ctx.status).to.equal(400);
    });
    it('Should return ok response for valid request', async () => {
      function Users() {/**/}

      (Users as any).find = () => null;
      Users.prototype.save = () => null;

      const signup = proxy(() => require('../../../src/api/controllers/auth').signup, {
        '../../models': { Users },
      });

      const ctx = new MockContext({
        body: {},
      });

      await callKoaFunction(ctx, signup);

      expect(ctx.status).to.equal(200);
    });
  });
});
