import * as Compose from 'koa-compose';
import * as Router from 'koa-router';

import {
  AuthMiddleware,
  ValidateSchema,
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

// Post route
publicRouter.get(
  '/posts',
  ValidateSchema(PostController.GetPostsParamsSchema, null),
  PostController.GetPosts,
);

publicRouter.get(
  '/posts/:postId',
  ValidateSchema(PostController.GetPostParamsSchema, null),
  PostController.GetPost,
);

privateRouter.post(
  '/posts',
  ValidateSchema(PostController.SavePostParamsSchema, PostController.SavePostBodySchema),
  PostController.SavePost,
);

privateRouter.delete(
  '/posts/:postId',
  ValidateSchema(PostController.DeletePostParamsSchema, null),
  PostController.DeletePost,
);

// Comments route
publicRouter.get(
  '/posts/:postId/comments',
  ValidateSchema(CommentController.GetCommentsParamsSchema, null),
  CommentController.GetComments,
);

publicRouter.get(
  '/posts/:postId/comments/:commentId',
  ValidateSchema(CommentController.GetCommentParamsSchema, null),
  CommentController.GetComment,
);

privateRouter.post(
  '/posts/:postId/comments',
  ValidateSchema(CommentController.SaveCommentParamsSchema, CommentController.SaveCommentBodySchema),
  CommentController.SaveComment,
);

privateRouter.delete(
  '/posts/:postId/comments/:commentId',
  ValidateSchema(CommentController.DeleteCommentParamsSchema, null),
  CommentController.DeleteComment,
);

export default Compose([
  publicRouter.routes(),
  publicRouter.allowedMethods(),
  privateRouter.routes(),
  privateRouter.allowedMethods(),
]);
