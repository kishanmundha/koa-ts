import { expect } from 'chai';
import 'mocha';

import { ValidateSchema } from '../../src/middleware';

describe('Validate schema middleware', () => {
  it('Should reject request for invalid params', async () => {
    const ctx = {
      params: {},
      status: 0,
    };

    await ValidateSchema({ id: { type: String, required: true } }, null)(ctx, async () => { ctx.status = 200; });

    expect(ctx.status).to.equal(400);
  });

  it('Should reject request for invalid body', async () => {
    const ctx = {
      params: {},
      request: {
        body: {},
      },
      status: 0,
    };

    await ValidateSchema(null, { id: { type: String, required: true } })(ctx, async () => { ctx.status = 200; });
    expect(ctx.status).to.equal(400);
  });

  it('Should accept request for valid params and body', async () => {
    const ctx = {
      params: {
        id: '123',
      },
      request: {
        body: {
          id: '123',
        },
      },
      status: 0,
    };

    await ValidateSchema(
      { id: { type: String, required: true } },
      { id: { type: String, required: true } },
    )(ctx, async () => { ctx.status = 200; });
    expect(ctx.status).to.equal(200);
  });
});
