import { gql } from '../__generated__/gql';

export const GET_ACCOUNT = gql(/* GraphQL */`
  query account {
      account {
        _id
        username
        avatar {
          url
        }
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
        username
        avatar {
          url
        }
        bio
        createdAt
      }
    }
  }
`);

export const GET_FEED_POSTS = gql(/* GraphQL */`
  query feedPosts($offset: Int!, $limit: Int!) {
    feedPosts(offset: $offset, limit: $limit) {
      _id
      title
      body
      author {
        _id
        username
        avatar {
          url
        }
      }
      voteCount
      voteStatus
      commentCount
      createdAt
      updatedAt
    }
  }
`);

export const GET_POSTS_COUNT = gql(/* GraphQL */`
    query Query {
    postsCount
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
        avatar {
          url
        }
      }
      voteCount
      voteStatus
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
        avatar {
          url
        }
      }
      voteCount
      voteStatus
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
