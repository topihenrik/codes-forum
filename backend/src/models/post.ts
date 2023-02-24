import { Schema, model } from 'mongoose';

export interface IPost {
  _id: string,
  title: string,
  body: string,
  author: Schema.Types.ObjectId,
  votes: [Schema.Types.ObjectId],
  voteCount: number,
  createdAt: Date,
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    votes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    voteCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default model<IPost>('Post', PostSchema);
