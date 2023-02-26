import { gql } from '../__generated__/gql';

export const GET_ACCOUNT = gql(/* GraphQL */`
  query account {
      account {
        _id
        username
        bio
      }
  }
`);

export const GET_PROFILE = gql(/* GraphQL */`
  query profile($_id: String!) {
    profile(_id: $_id) {
      id
      postCount
      commentCount
      recentPosts {
        _id
        title
        voteCount
        commentCount
        createdAt
      }
      recentComments {
        _id
        body
        post {
          _id
        }
        voteCount
        createdAt
        updatedAt
      }
      user {
        _id
        bio
        username
        createdAt
      }
    }
  }
`);

export const GET_POSTS = gql(/* GraphQL */`
  query posts {
    posts {
      _id
      title
      body
      author {
        _id
        username
      }
      voteCount
      commentCount
      createdAt
      updatedAt
    }
  }
`);

export const GET_POST = gql(/* GraphQL */`
  query post($_id: String!) {
    post(_id: $_id) {
      _id
      title
      body
      author {
        _id
        username
      }
      voteCount
      createdAt
      updatedAt
    }
  }
`);

export const GET_COMMENTS = gql(/* GraphQL */`
  query comments($post: String!) {
    comments(post: $post) {
      _id
      body
      author {
        _id
        username
      }
      voteCount
      createdAt
      updatedAt
    }
  }
`);

export const GET_COMMENT = gql(/* GraphQL */`
  query comment($_id: String!) {
    comment(_id: $_id) {
      _id
      body
      author {
        _id
        username
      }
      voteCount
      createdAt
      updatedAt
    }
  }
`);
