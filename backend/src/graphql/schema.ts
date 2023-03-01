import gql from 'graphql-tag';

const typeDefs = gql`
    scalar DateTime

    enum Vote {
        NONE
        UP
    }

    type User {
        _id: ID
        username: String
        bio: String
        createdAt: DateTime
    }

    type Profile {
        id: ID
        user: User
        postCount: Int
        commentCount: Int
        recentPosts: [Post]
        recentComments: [Comment]
    }

    type Post {
        _id: ID
        title: String
        body: String
        author: User
        voteCount: Int
        voteStatus: Vote
        commentCount: Int
        createdAt: DateTime
        updatedAt: DateTime
    }

    type Comment {
        _id: ID
        body: String
        post: Post
        author: User
        voteCount: Int
        voteStatus: Vote
        createdAt: DateTime
        updatedAt: DateTime
    }

    type Token {
        value: String!
    }

    type Query {
        account: User
        profile(_id: String!): Profile
        posts: [Post!]
        feedPosts(offset: Int!, limit: Int!): [Post!]
        postsCount: Int
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
        editBasicUser(
            _id: String!
            username: String!
            bio: String!
        ): User
        editPasswordUser(
            _id: String!
            old_password: String!
            password: String!
            password_confirm: String!
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
        votePost(
            _id: String!
            voteStatus: Vote!
        ): Post
        createComment(
            body: String!
            post: String!
        ): Comment
        editComment(
            _id: String!
            body: String!
        ): Comment
        voteComment(
            _id: String!
            voteStatus: Vote!
        ): Comment
    }
`;

export default typeDefs;
