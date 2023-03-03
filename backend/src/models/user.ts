import { Schema, model } from 'mongoose';

interface IAvatar {
  url: string,
  public_id: string
}

export interface IUser {
  _id: string,
  username: string,
  password: string,
  avatar: IAvatar,
  bio: string,
  admin: boolean,
  createdAt: Date,
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    bio: { type: String, default: '' },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>('User', UserSchema);
