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

export const EDIT_BASIC_USER = gql(/* GraphQL */`
  mutation editBasicUser($_id: String!, $username: String!, $bio: String!) {
    editBasicUser(
      _id: $_id
      username: $username
      bio: $bio
    ) {
      _id
      username
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
