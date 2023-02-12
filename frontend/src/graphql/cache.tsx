import { makeVar } from '@apollo/client';

export const tokenVar = makeVar<null | string>(localStorage.getItem('auth_token'));
