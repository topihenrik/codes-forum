import gql from 'graphql-tag';

const typeDefs = gql`
    scalar DateTime
    scalar Upload
    scalar ObjectID
    scalar Void

    enum Vote {
        NONE
        UP
    }

    type Avatar {
        url: String
    }

    type User {
        _id: ID
        username: String
        avatar: Avatar
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
        tags: [String!]
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
        feedPosts(offset: Int!, limit: Int!): [Post!]
        postsCount: Int
        post(_id: String!): Post
        comments(post: String!): [Comment!]
        comment(_id: String!): Comment
    }

    type Mutation {
        createUser(
            username: String! @constraint(minLength: 3, maxLength: 32)
            password: String! @constraint(minLength: 3, maxLength: 255)
            password_confirm: String! @constraint(minLength: 3, maxLength: 255)
            avatar: Upload
        ): User
        editBasicUser(
            _id: String!
            username: String! @constraint(minLength: 3, maxLength: 32)
            bio: String!
            avatar: Upload
        ): User
        editPasswordUser(
            _id: String!
            old_password: String! @constraint(minLength: 3, maxLength: 255)
            password: String! @constraint(minLength: 3, maxLength: 255)
            password_confirm: String! @constraint(minLength: 3, maxLength: 255)
        ): User
        login(
            username: String!
            password: String!
        ): Token
        deleteUser(
          username: String!
          password: String!
        ): Void
        createPost(
            title: String!
            body: String!
            tags: [String]!
        ): Post
        editPost(
            _id: String!
            title: String!
            body: String!
            tags: [String]!
        ): Post
        votePost(
            _id: String!
            voteStatus: Vote!
        ): Post
        deletePost(
          _id: String!
        ): Void
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
        deleteComment(
          _id: String!
        ): Void
    }
`;

export default typeDefs;
