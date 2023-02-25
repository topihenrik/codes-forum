import { gql } from '../__generated__/gql';

export const CREATE_USER = gql(/* GraphQL */`
  mutation createUser($username: String!, $password: String!, $password_confirm: String!) {
    createUser(
      username: $username
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
  mutation createPost($title: String!, $body: String!) {
    createPost(
      title: $title
      body: $body
    ) {
      _id
    }
  }
`);

export const EDIT_POST = gql(/* GraphQL */`
  mutation editPost($_id: String!, $title: String!, $body: String!) {
    editPost(
      _id: $_id
      title: $title
      body: $body
    ) {
      _id
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
    }
  }
`);
