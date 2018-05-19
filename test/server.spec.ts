import { expect } from 'chai';
import 'mocha';
import { proxy } from 'proxyrequire';

import { Koa } from './helpers/koa-app';

describe('...', () => {
  it('Should start', async () => {
    const server = proxy(() => require('../src/server').default, {
      koa: Koa,
      mongoose: {
        connect: async () => {
          //
        },
      },
    });

    await server;
  });
});
