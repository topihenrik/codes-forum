import { gql } from '@apollo/client';

export const GET_TOKEN = gql`
    query GetToken {
        token @client
    }
`;
