import * as Debug from 'debug';
import * as Koa from 'koa';

const error = Debug('app:error');
error.log = console.info.bind(console);

const errorHandler = async (ctx, next) => {
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
};

export default errorHandler;
