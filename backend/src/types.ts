export interface IToken {
  _id: string,
  username: string
}

export interface ICurrentUser {
  username: string,
  password: string,
  bio: string,
  admin: boolean,
  _id: string
}
