import { Resolvers } from "./__generated__/resolvers-types";
import Book from "./models/book.js";

const resolvers: Resolvers = {
    Query: {
        books: async () =>  Book.find({}),
    },
};


export { resolvers };