import { InMemoryCache, makeVar } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { decodeToken, type IDecodedToken } from './utils';

export const feedPostsPageVar = makeVar<number>(1);
export const decodedTokenVar = makeVar<null | IDecodedToken>(decodeToken(localStorage.getItem('auth_token')));
export const errorVar = makeVar<string>('');

// Apollo Client configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feedPostsPage: {
          read() {
            return feedPostsPageVar();
          },
        },
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
        feedPosts: {
          ...offsetLimitPagination(),
          read(existing, { args }) {
            if (args && (typeof args.offset === 'number' && typeof args.limit === 'number')) {
              return existing && existing.slice(args.offset, args.offset + args.limit);
            }
            return undefined;
          },
        },
      },
    },
  },
});

export default cache;
