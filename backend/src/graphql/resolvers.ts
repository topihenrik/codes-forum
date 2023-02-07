import { Resolvers } from "../__generated__/resolvers-types";
import Book from "../models/book.js";
import { dateScalar } from "./types.js";

const resolvers: Resolvers = {
    Date: dateScalar,
    Query: {
        books: async () =>  Book.find({}),
    },
};

export { resolvers };