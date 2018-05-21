export interface IValidationSchema {
  [key: string]: {
    type: any;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    validate?: (value: any) => boolean;
  };
}
