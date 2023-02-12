import { gql } from '../__generated__';

export const CREATE_USER = gql(/* GraphQL */`
    mutation createUser($username: String!, $password: String!, $password_confirm: String!) {
        createUser(
            username: $username
            password: $password
            password_confirm: $password_confirm
        ) {
            id
            username
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
