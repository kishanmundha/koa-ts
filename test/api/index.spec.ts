import { expect } from 'chai';
import 'mocha';
import { proxy } from 'proxyrequire';

import api from '../../src/api/index';

describe('Router', () => {
  it('Alive api', async () => {
    const ctx: any = {};
    ctx.path = '/alive';
    ctx.method = 'GET';
    ctx.set = () => {/**/};
    await api(ctx);

    expect(ctx.body.status).to.equal('ok');
  });
});
