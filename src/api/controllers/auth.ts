import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';

import { User } from '../../models';

interface IRequestLogin {
  username: string;
  password: string;
}

export const login = async (ctx: Koa.Context) => {
  const { username, password } = ctx.request.body as IRequestLogin;

  if (!username || !password) {
    ctx.throw(400);
  }

  const user = await User.findOne({ username, password });

  if (!user) {
    ctx.body = {
      code: 401,
      error: {
        message: 'Invalid username or password',
      },
      success: false,
    };
    return;
  }

  const expiredOn = Date.now() + (1000 * 60 * 60);
  const authInfo = {
    expiredOn,
    username,
  };

  const token = jwt.sign(JSON.stringify(authInfo), config.get<any>('jwt').secret);

  ctx.body = {
    code: 200,
    data: {
      expiredOn,
      token,
      username,
    },
    success: true,
  };
};

export const signup = async (ctx: Koa.Context) => {
  const { username, password, firstName, lastName } = ctx.request.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    ctx.throw(400, 'username or email already registered');
  }

  const user = new User({
    firstName,
    lastName,
    password,
    username,
  });

  await user.save();

  ctx.body = {
    success: true,
  };
};
