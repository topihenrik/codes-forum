import { GraphQLError } from 'graphql';
import { DateResolver } from 'graphql-scalars';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { Resolvers } from '../__generated__/resolvers-types';
import Book from '../models/book.js';
import User from '../models/user.js';

const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {
    books: async () => Book.find({}),
  },
  Mutation: {
    createUser: async (root, args) => {
      // username field validation
      if (args.username.length < 3) {
        throw new GraphQLError('password min length is 3', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const usernameTaken = await User.findOne({ username: args.username });

      if (usernameTaken) {
        throw new GraphQLError('username already in use', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      // password field validation
      if (args.password.length < 3) {
        throw new GraphQLError('password min length is 3', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (args.password !== args.password_confirm) {
        throw new GraphQLError("passwords don't match", { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      try {
        const newUser = new User({ username: args.username, password: hashedPassword });
        return await newUser.save();
      } catch (error) {
        throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT' } });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      // Incorrect username OR Incorrect password
      if (!user || !(await bcrypt.compare(args.password, user.password))) {
        throw new GraphQLError('incorrect credentials', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const token = {
        id: user.id,
        username: user.username,
      };

      return { value: jwt.sign(token, config.JWT_SECRET) };
    },
  },
};

export default resolvers;
