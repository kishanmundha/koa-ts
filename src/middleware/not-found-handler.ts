const notFoundHandler = async (ctx, next) => {
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
};

export default notFoundHandler;
