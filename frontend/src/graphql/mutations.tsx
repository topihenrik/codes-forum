import { gql } from '../__generated__/gql';

export const CREATE_USER = gql(/* GraphQL */`
  mutation createUser($username: String!, $password: String!, $password_confirm: String!, $avatar: Upload) {
    createUser(
      username: $username
      password: $password
      password_confirm: $password_confirm
      avatar: $avatar
    ) {
      _id
    }
  }
`);

export const EDIT_BASIC_USER = gql(/* GraphQL */`
  mutation editBasicUser($_id: String!, $username: String!, $bio: String!, $avatar: Upload) {
    editBasicUser(
      _id: $_id
      username: $username
      bio: $bio
      avatar: $avatar
    ) {
      _id
      username
      avatar {
          url
        }
      bio
    }
  }
`);

export const EDIT_PASSWORD_USER = gql(/* GraphQL */`
  mutation EditPasswordUser($_id: String!, $old_password: String!, $password: String!, $password_confirm: String!) {
    editPasswordUser(
      _id: $_id
      old_password: $old_password
      password: $password
      password_confirm: $password_confirm
    ) {
      _id
    }
  }
`);

export const LOGIN_USER = gql(/* GraphQL */`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`);

export const CREATE_POST = gql(/* GraphQL */`
  mutation createPost($title: String!, $body: String!, $tags: [String]!) {
    createPost(
      title: $title
      body: $body
      tags: $tags
    ) {
      _id
      title
      body
      tags
      author {
        _id
        username
      }
      voteCount
      voteStatus
      commentCount
      createdAt
      updatedAt
    }
  }
`);

export const EDIT_POST = gql(/* GraphQL */`
  mutation editPost($_id: String!, $title: String!, $body: String!, $tags: [String]!) {
    editPost(
      _id: $_id
      title: $title
      body: $body
      tags: $tags
    ) {
      _id
      title
      body
      author {
        _id
        username
      }
      voteCount
      voteStatus
      commentCount
      createdAt
      updatedAt
    }
  }
`);

export const VOTE_POST = gql(/* GraphQL */`
  mutation votePost($_id: String!, $voteStatus: Vote!) {
    votePost(
      _id: $_id
      voteStatus: $voteStatus
    ) {
      _id
      voteCount
      voteStatus
    }
  }
`);

export const CREATE_COMMENT = gql(/* GraphQL */`
  mutation createComment($body: String!, $post: String!) {
    createComment(
      body: $body
      post: $post
    ) {
      _id
      body
      author {
        _id
        username
      }
      voteCount
      voteStatus
      createdAt
      updatedAt
    }
  }
`);

export const EDIT_COMMENT = gql(/* GraphQL */`
  mutation editComment($_id: String!, $body: String!) {
    editComment(
      _id: $_id
      body: $body
    ) {
      _id
      body
      author {
        _id
        username
      }
      voteCount
      voteStatus
      createdAt
      updatedAt
    }
  }
`);

export const VOTE_COMMENT = gql(/* GraphQL */`
  mutation voteComment($_id: String!, $voteStatus: Vote!) {
    voteComment(
      _id: $_id
      voteStatus: $voteStatus
    ) {
      _id
      voteCount
      voteStatus
    }
  }
`);
