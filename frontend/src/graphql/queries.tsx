/* eslint-disable import/prefer-default-export */
import { gql } from '../__generated__/gql';

export const GET_ACCOUNT = gql(/* GraphQL */`
  query account {
      account {
        id
        username
        bio
      }
  }
`);
