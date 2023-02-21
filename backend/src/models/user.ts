import { Schema, model } from 'mongoose';

export interface IUser {
  username: string,
  password: string,
  bio: string,
  admin: boolean,
  createdAt: Date,
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    admin: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
);

UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default model<IUser>('User', UserSchema);
