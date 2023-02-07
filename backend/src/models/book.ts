import { Schema, model } from "mongoose";

interface IBook {
    title: string,
    author: string
}

const BookSchema = new Schema<IBook>(
    {
        title: { type: String },
        author: { type: String }
    }
);

export default model<IBook>("Book", BookSchema);