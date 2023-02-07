import { Schema, model } from "mongoose";

interface IPost {
    title: string,
    code: string,
    message: string,
    author: Schema.Types.ObjectId,
    likes: [Schema.Types.ObjectId],
    likeCount: number,
    createdAt: Date,
    updatedAt: Date
}

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        code: { type: String, required: true },
        message: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        likes: { type: [Schema.Types.ObjectId], ref: "User" },
        likeCount: { type: Number },
        createdAt: { type: Date },
        updatedAt: { type: Date }
    }
);

PostSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

export default model<IPost>("Post", PostSchema);