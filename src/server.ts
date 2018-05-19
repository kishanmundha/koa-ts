import * as config from 'config';
import * as Debug from 'debug';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Mount from 'koa-mount';
import * as Mongoose from 'mongoose';

import api from './api';
import { ErrorHandler, NotFoundHandler } from './middleware';

const debug = Debug('app:server');
const error = Debug('app:error');
error.log = console.info.bind(console);

const server = (async () => {
  try {
    await Mongoose.connect(config.get('db'));
    debug(`Server connected to db "${config.get('db')}"`);

    const app = new Koa();

    // Handle exception
    app.use(ErrorHandler);

    app.use(bodyParser());
    app.use(Mount('/api/1.0', api));

    // Request url not found
    app.use(NotFoundHandler);

    app.listen(config.get('port'));
    debug(`Server running on port ${config.get('port')}`);
  } catch (e) {
    error(e.message || 'Unknown execption');
  }
})();

export default server;
