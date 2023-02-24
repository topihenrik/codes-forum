import { InMemoryCache, makeVar } from '@apollo/client';

export const tokenVar = makeVar<null | string>(localStorage.getItem('auth_token'));
export const errorVar = makeVar<string>('');

// Apollo Client configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        token: {
          read() {
            return tokenVar();
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
