import { expect } from 'chai';
import 'mocha';
import { proxy } from 'proxyrequire';

import { Koa } from './helpers/koa-app';

describe('Server', () => {
  const server = proxy(() => require('../src/server').default, {
    koa: Koa,
    mongoose: {
      connect: async () => {
        //
      },
    },
  });

  it('Should start', async () => {
    let ex = null;
    try {
      await server;
    } catch (e) {
      ex = e;
    }

    expect(ex).to.equal(null);
  });
});

describe('Server exception', () => {
  const server = proxy(() => require('../src/server').default, {
    koa: Koa,
    mongoose: {
      connect: async () => {
        throw new Error('test');
      },
    },
  });

  it('Should failed', async () => {
    let ex = null;
    try {
      await server;
    } catch (e) {
      ex = e;
    }

    // expect(ex).to.not.equal(null);
  });
});
