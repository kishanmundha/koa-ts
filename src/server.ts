import * as config from 'config';
import * as Debug from 'debug';
import * as Koa from 'koa';
import * as Router from 'koa-router';

const debug = Debug('app');

const app = new Koa();
const router = new Router();

router.get('/alive', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: Date.now(),
  };
});

router.all('/*', async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    code: 404,
    message: 'Requested path not found',
    path: ctx.path,
  };
});

app.use(router.routes());

app.listen(config.get('port'));
debug(`Server running on port ${config.get('port')}`);
