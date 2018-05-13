import * as Compose from 'koa-compose';
import * as Router from 'koa-router';

import {
  AuthMiddleware,
} from '../middleware';

import * as AuthController from './controllers/auth';
import * as CommentController from './controllers/comment';
import * as PostController from './controllers/post';

const publicRouter = new Router();
const privateRouter = new Router();

privateRouter.use(AuthMiddleware);

publicRouter.get('/alive', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: Date.now(),
  };
});

publicRouter.post('/login', AuthController.login);
publicRouter.post('/signup', AuthController.signup);

publicRouter.get('/posts', PostController.GetPosts);
publicRouter.get('/posts/:postId', PostController.GetPost);
privateRouter.post('/posts', PostController.SavePost);
privateRouter.delete('/posts/:postId', PostController.DeletePost);

publicRouter.get('/posts/:postId/comments', CommentController.GetComments);
publicRouter.get('/posts/:postId/comments/:commentId', CommentController.GetComment);
privateRouter.post('/posts/:postId/comments', CommentController.SaveComment);
privateRouter.delete('/posts/:postId/comments/:commentId', CommentController.DeleteComment);

export default Compose([
  publicRouter.routes(),
  publicRouter.allowedMethods(),
  privateRouter.routes(),
  privateRouter.allowedMethods(),
]);
