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
