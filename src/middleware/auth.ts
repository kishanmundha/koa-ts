import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';

const auth = async (ctx: Koa.Context, next) => {
  const authorization = ctx.get('Authorization');
  let token;
  let authInfo;
  if (authorization) {
    token = authorization.replace(/^bearer /ig, '');
  }

  if (token) {
    authInfo = jwt.decode(token, config.get<any>('jwt').secret);
  }

  if (!authInfo) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: 'Unauthorized request',
      path: ctx.path,
    };
    return;
  }

  await next();
};

export default auth;
