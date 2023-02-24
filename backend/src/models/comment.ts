import { Schema, model } from 'mongoose';

interface IComment {
  _id: string,
  body: string,
  post: Schema.Types.ObjectId,
  author: Schema.Types.ObjectId,
  votes: [Schema.Types.ObjectId],
  voteCount: number,
  createdAt: Date,
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    body: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    votes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    voteCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default model<IComment>('Comment', CommentSchema);
