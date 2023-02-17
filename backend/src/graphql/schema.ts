import gql from 'graphql-tag';

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
            username: String! @constraint(minLength: 3, maxLength: 255)
            password: String! @constraint(minLength: 3, maxLength: 255)
            password_confirm: String! @constraint(minLength: 3, maxLength: 255)
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }
`;

export default typeDefs;
