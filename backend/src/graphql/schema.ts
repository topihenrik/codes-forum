import gql from "graphql-tag";

const typeDefs = gql`
    scalar Date

    type Book {
        _id: ID
        title: String
        author: String
    }
    
    type User {
        id: ID
        username: String
        password: String
        bio: String
        admin: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type Post {
        id: ID
        title: String
        code: String
        message: String
        author: User
        likes: [User]
        likeCount: Int
        createdAt: Date
        updatedAt: Date
    }

    type Comment {
        id: ID
        body: String
        author: User
        likes: [User]
        likeCount: Int
        createdAt: Date
        updatedAt: Date
    }

    type Token {
        value: String!
    }

    type Query {
        books: [Book!]!
    }

    type Mutation {
        createUser(
            username: String!
            password: String!
            password_confirm: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }
`

export default typeDefs;