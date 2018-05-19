import { expect } from 'chai';
import 'mocha';

import * as jwt from 'jsonwebtoken';

import auth from '../../src/middleware/auth';
import context from '../helpers/context';

describe('Auth middleware', () => {
  it('Should reject request on no header', async () => {
    const mockContext = context(null, null);

    await auth(mockContext as any, () => {
      mockContext.status = 200;
    });

    expect(mockContext.status).to.equal(401);
    expect(mockContext.body).to.deep.equal({
      code: 401,
      message: 'Unauthorized request',
      path: '/',
    });
  });

  it('Should reject request on empty token', async () => {
    const mockContext = context({
      headers: {
        Authorization: 'Bearer',
      },
    }, null);

    await auth(mockContext as any, () => {
      mockContext.status = 200;
    });

    expect(mockContext.status).to.equal(401);
  });

  it('Should reject request on invalid token', async () => {
    const mockContext = context({
      headers: {
        Authorization: 'Bearer 324234dfsf',
      },
    }, null);

    await auth(mockContext as any, () => {
      mockContext.status = 200;
    });

    expect(mockContext.status).to.equal(401);
  });

  it('Should accept request on valid token', async () => {
    const mockContext = context({
      headers: {
        Authorization: `Bearer ${jwt.sign('test', '1234')}`,
      },
    }, null);

    await auth(mockContext as any, () => {
      mockContext.status = 200;
    });

    expect(mockContext.status).to.equal(200);
  });
});
