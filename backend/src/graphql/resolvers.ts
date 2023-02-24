import { GraphQLError } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { type Comment as CommentType, Resolvers, type Post as PostType } from '../__generated__/resolvers-types';
import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import { IToken } from '../types';

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Post: {
    author: async (root) => User.findById(root.author),
  },
  Comment: {
    author: async (root) => User.findById(root.author),
  },
  Query: {
    account: async (root, args, context) => context.currentUser,
    posts: async () => Post.find({}),
    post: async (root, args) => Post.findById(args._id),
    comments: async (root, args) => Comment.find({ post: args.post }),
  },
  Mutation: {
    createUser: async (root, args) => {
      const existingUsername = await User.findOne({ username: args.username });
      if (existingUsername) {
        throw new GraphQLError('username already exists', { extensions: { code: 'BAD_USER_INPUT' } });
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

      const token: IToken = {
        _id: user._id,
        username: user.username,
      };

      return { value: jwt.sign(token, config.JWT_SECRET) };
    },
    createPost: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const newPost = new Post(
        {
          title: args.title,
          body: args.body,
          author: context.currentUser._id,
        },
      );
      return newPost.save() as Promise<PostType>;
    },
    createComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const newComment = new Comment(
        {
          body: args.body,
          post: args.post,
          author: context.currentUser._id,
        },
      );
      return newComment.save() as Promise<CommentType>;
    },
  },
};

export default resolvers;
