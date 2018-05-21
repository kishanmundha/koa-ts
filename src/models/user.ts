import * as Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema({
  firstName: { type: Mongoose.Schema.Types.String, required: true },
  lastName: { type: Mongoose.Schema.Types.String, required: true },
  password: { type: Mongoose.Schema.Types.String, required: true },
  username: { type: Mongoose.Schema.Types.String, required: true },
});

interface IUser extends Mongoose.Document {
  firstName: Mongoose.Schema.Types.String;
  lastName: Mongoose.Schema.Types.String;
  password: Mongoose.Schema.Types.String;
  username: Mongoose.Schema.Types.String;
}

const User = Mongoose.model<IUser>('users', UserSchema, 'users');

export {
  IUser,
  User,
};
