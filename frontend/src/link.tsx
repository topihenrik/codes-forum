import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink(
  {
    uri: import.meta.env.VITE_NODE_ENV === 'production' ? '/graphql' : 'http://localhost:4000/graphql',
  },
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});

export default authLink.concat(httpLink);
