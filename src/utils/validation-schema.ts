import * as Mongoose from 'mongoose';

import { IValidationSchema } from '../interfaces';

export const ValidationSchema = (schema: IValidationSchema) => {
  Object.keys(schema).forEach((key) => {
    if (schema[key].type === Mongoose.Types.ObjectId) {
      schema[key].type = String;

      const orignalValidate = schema[key].validate;

      schema[key].validate = (value) => {
        return Mongoose.Types.ObjectId.isValid(value) && (!orignalValidate || orignalValidate(value));
      };
    }
  });

  return schema;
};
