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
        comments(post: String!): [Comment!]
        comment(_id: String!): Comment
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
        editPost(
            _id: String!
            title: String!
            body: String!
        ): Post
        createComment(
            body: String!
            post: String!
        ): Comment
        editComment(
            _id: String!
            body: String!
        ): Comment
    }
`;

export default typeDefs;
