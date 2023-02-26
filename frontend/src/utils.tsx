import jwt_decode from 'jwt-decode';

export interface IDecodedToken {
  iat: number,
  _id: string,
  username: string
}

export function decodeToken(token: string | null): IDecodedToken | null {
  if (token !== null) {
    return jwt_decode(token);
  }
  return null;
}
