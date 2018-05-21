import { IValidationSchema } from '../interfaces';
import { ValidateSchema } from '../utils/validate-schema';

export default (schemaParams?: IValidationSchema, schemaBody?: IValidationSchema) => async (ctx, next) => {
  const messages = [];

  if (schemaParams) {
    Array.prototype.push.apply(messages, ValidateSchema(schemaParams, ctx.params));
  }

  if (schemaBody) {
    Array.prototype.push.apply(messages, ValidateSchema(schemaBody, ctx.request.body));
  }

  if (messages.length) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid request',
      messageDetail: messages,
    };
    return;
  }

  await next();
};
