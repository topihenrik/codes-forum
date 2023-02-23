import { Schema, model } from 'mongoose';

interface IComment {
  _id: string,
  body: string,
  post: Schema.Types.ObjectId,
  author: Schema.Types.ObjectId,
  votes: [Schema.Types.ObjectId],
  voteCount: number,
  tags: [string],
  createdAt: Date,
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    body: { type: String },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    votes: { type: [Schema.Types.ObjectId], ref: 'User' },
    voteCount: { type: Number },
    tags: { type: [String] },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
);

export default model<IComment>('Comment', CommentSchema);
