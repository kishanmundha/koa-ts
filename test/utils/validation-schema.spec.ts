import { expect } from 'chai';
import 'mocha';
import * as Mongoose from 'mongoose';

import { ValidationSchema } from '../../src/utils/validation-schema';

describe('Validation Schema', () => {
  it('Should convert type Mongoose type to String and validate', () => {
    const result = ValidationSchema({
      id: { type: Mongoose.Types.ObjectId, validate: (value) => true },
    });

    expect(result.id.type).to.equal(String);

    expect(result.id.validate('1234')).to.equal(false);

    expect(result.id.validate('0123456789abcdef01234567')).to.equal(true);
  });
});
