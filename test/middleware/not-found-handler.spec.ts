import { expect } from 'chai';
import 'mocha';

import notFoundHandler from '../../src/middleware/not-found-handler';

describe('Not found handler', () => {
  it('Test', async() => {
    notFoundHandler({}, async () => {
      //
    });

    notFoundHandler({
      path: '/alive',
    }, async () => {
      //
    });
  });
});
