import { expect } from 'chai';
import 'mocha';

import errorHandler from '../../src/middleware/error-handler';

describe('Error handler', () => {
  it('Success block', async () => {
    errorHandler({}, async () => {
      //
    });
  });

  it('Error block', async () => {
    errorHandler({}, async () => {
      throw {
        message: 'test',
        messages: [],
        status: 400,
      };
    });
  });

  it('Error block', async () => {
    errorHandler({}, async () => {
      throw {
        messages: [],
        status: 400,
      };
    });
  });

  it('Error block', async () => {
    errorHandler({}, async () => {
      throw {
      };
    });
  });
});
