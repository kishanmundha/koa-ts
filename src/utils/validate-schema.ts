import { IValidationSchema } from '../interfaces';

export const ValidateSchema = (schema: IValidationSchema, value) => {
  const messages = [];
  Object.keys(schema).forEach((key) => {
    switch (schema[key].type) {
      case String:
        if (!value[key]) {
          if (schema[key].required) {
            messages.push({
              message: `${key} required`,
            });
          }
        } else if (typeof value[key] !== 'string') {
          messages.push({
            message: `${key} should a string`,
          });
        } else if (schema[key].maxLength && value[key].length > schema[key].maxLength) {
          messages.push({
            message: `${key} max ${schema[key].maxLength} character allowed`,
          });
        } else if (schema[key].minLength && value[key].length < schema[key].minLength) {
          messages.push({
            message: `${key} minimum ${schema[key].minLength} character required`,
          });
        } else if (schema[key].validate && typeof schema[key].validate === 'function') {
          if (!schema[key].validate(value[key])) {
            messages.push({
              message: `${key} contains invalid value`,
            });
          }
        }
        break;
    }
  });

  return messages;
};
