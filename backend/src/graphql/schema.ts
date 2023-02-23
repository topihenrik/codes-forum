import gql from 'graphql-tag';

const typeDefs = gql`
    scalar DateTime

    type User {
        _id: ID
        username: String
        bio: String
    }

    type Post {
        _id: ID
        title: String
        body: String
        author: User
        voteCount: Int
        createdAt: DateTime
        updatedAt: DateTime
    }

    type Comment {
        _id: ID
        body: String
        author: User
        votes: [User]
        voteCount: Int
        createdAt: DateTime
        updatedAt: DateTime
    }

    type Token {
        value: String!
    }

    type Query {
        account: User
        posts: [Post!]
        post(_id: String!): Post
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
        createPost(
            title: String!
            body: String!
        ): Post
    }
`;

export default typeDefs;
