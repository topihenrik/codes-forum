import { InMemoryCache, makeVar } from '@apollo/client';
import { decodeToken, type IDecodedToken } from './utils';

export const decodedTokenVar = makeVar<null | IDecodedToken>(decodeToken(localStorage.getItem('auth_token')));
export const errorVar = makeVar<string>('');

// Apollo Client configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        decodedToken: {
          read() {
            return decodedTokenVar();
          },
        },
        error: {
          read() {
            return errorVar();
          },
        },
      },
    },
  },
});

export default cache;
