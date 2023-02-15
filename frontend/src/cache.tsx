import { InMemoryCache, makeVar } from '@apollo/client';

export const tokenVar = makeVar<null | string>(localStorage.getItem('auth_token'));

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
      },
    },
  },
});

export default cache;
