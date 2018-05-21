import { expect } from 'chai';
import 'mocha';

import { ValidateSchema } from '../../src/utils/validate-schema';

describe('Validate schema', () => {
  it('Should validate empty string with no validation', () => {
    const result = ValidateSchema(
      { id: { type: String } },
      { id: '' },
    );

    expect(result.length).to.equal(0);
  });

  it('Should validate required', () => {
    const result = ValidateSchema(
      { id: { type: String, required: true } },
      { id: '' },
    );

    expect(result[0].message).to.equal('id required');
  });

  it('Should validate a valid string', () => {
    const result = ValidateSchema({
      id: { type: String },
    }, {
        id: 'test',
      });
    expect(result.length).to.equal(0);
  });

  it('Should validate non string type', () => {
    const result = ValidateSchema(
      { id: { type: String } },
      { id: 1 },
    );
    expect(result[0].message).to.equal('id should a string');
  });

  it('Should validate max length', () => {
    const result = ValidateSchema(
      { id: { type: String, maxLength: 10 } },
      { id: 'test test test' },
    );
    expect(result[0].message).to.equal('id max 10 character allowed');
  });

  it('Should validate min length', () => {
    const result = ValidateSchema(
      { id: { type: String, minLength: 5 } },
      { id: 'test' });
    expect(result[0].message).to.equal('id minimum 5 character required');
  });

  it('Should validate function with ok', () => {
    const result = ValidateSchema(
      { id: { type: String, validate: () => true } },
      { id: 'id' },
    );
    expect(result.length).to.equal(0);
  });

  it('Should validate function with invalid value', () => {
    const result = ValidateSchema(
      { id: { type: String, validate: () => false } },
      { id: 'id' },
    );
    expect(result[0].message).to.equal('id contains invalid value');
  });
});
