import { Schema, model } from "mongoose";

interface IComment {
    body: string,
    post: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId,
    likes: [Schema.Types.ObjectId],
    likeCount: number,
    tags: [string],
    createdAt: Date,
    updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
    {
        body: { type: String },
        post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
        author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        likes: {type: [Schema.Types.ObjectId], ref: "User" },
        likeCount: { type: Number },
        tags: { type: [String] },
        createdAt: { type: Date },
        updatedAt: { type: Date }
    }
);

export default model<IComment>("Comment", CommentSchema);