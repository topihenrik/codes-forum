import jwt from 'jsonwebtoken';
import config from './config.js';
import User from './models/user.js';
import { IToken, ICurrentUser } from './types';

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null;
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET) as IToken;
    const currentUser = await User.findById(decodedToken._id);
    return { currentUser: currentUser.toJSON() as ICurrentUser };
  }
  return null;
};

export default context;
