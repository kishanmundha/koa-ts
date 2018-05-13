import * as config from 'config';
import * as Debug from 'debug';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Mount from 'koa-mount';
import * as Mongoose from 'mongoose';

import api from './api';

const debug = Debug('app:server');
const error = Debug('app:error');
error.log = console.info.bind(console);

(async () => {
  try {
    await Mongoose.connect(config.get('db'));
    debug(`Server connected to db "${config.get('db')}"`);

    const app = new Koa();

    // Handle exception
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (e) {
        const status = e.status || 500;
        const message = status === 500 ? 'Internal server error' : (e.message || 'Unknown');
        const messages = e.messages || [];

        if (status === 500) {
          error(e);
        }

        ctx.status = status;
        ctx.body = {
          code: status,
          message,
          messages,
          path: ctx.path,
        };
      }
    });

    app.use(bodyParser());
    app.use(Mount('/api/1.0', api));

    // Request url not found
    app.use(async (ctx, next) => {
      if (ctx.path === '/alive') {
        ctx.body = {
          status: 'ok',
          timestamp: Date.now(),
        };
        return;
      }

      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: 'Requested path not found',
        path: ctx.path,
        success: false,
      };
    });

    app.listen(config.get('port'));
    debug(`Server running on port ${config.get('port')}`);
  } catch (e) {
    error(e.message || 'Unknown execption');
  }
})();
