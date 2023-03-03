import { GraphQLError } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import {
  type Comment as CommentType, Resolvers, type Post as PostType,
} from '../__generated__/resolvers-types';
import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import { IToken } from '../types';
import { uploadImage, destroyImage } from '../cloudinary.js';

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Upload: GraphQLUpload,
  Profile: {
    user: async (root) => User.findById(root.id),
    postCount: async (root) => Post.find({ author: root.id }).count(),
    commentCount: async (root) => Comment.find({ author: root.id }).count(),
    recentPosts: async (root) => Post.find({ author: root.id }).sort('-createdAt').limit(3).lean(),
    recentComments: async (root) => Comment.find({ author: root.id }).sort('-createdAt').limit(3).lean(),
  },
  Post: {
    author: async (root) => User.findById(root.author),
    commentCount: async (root) => Comment.find({ post: root._id }).count(),
  },
  Comment: {
    author: async (root) => User.findById(root.author),
  },
  Query: {
    account: async (root, args, context) => context.currentUser,
    profile: async (root, args) => ({ id: args._id }),
    feedPosts: async (root, args, context) => {
      const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .skip(args.offset)
        .limit(args.limit)
        .lean();
      if (!context.currentUser) {
        return posts as PostType[];
      }

      const finalPosts = posts.map((post) => {
        const votingResult = post.votes.find(
          (id) => id.toString() === context.currentUser._id.toString(),
        );
        if (votingResult) {
          return { ...post, voteStatus: 'UP' };
        }
        return { ...post, voteStatus: 'NONE' };
      });
      return finalPosts as PostType[];
    },
    postsCount: async () => Post.find({}).count(),
    post: async (root, args, context) => {
      const thepost = await Post.findById(args._id).lean();
      if (!context.currentUser) {
        return thepost as PostType;
      }
      const votingResult = thepost.votes.find(
        (id) => id.toString() === context.currentUser._id.toString(),
      );
      if (votingResult) {
        return { ...thepost, voteStatus: 'UP' } as PostType;
      }
      return { ...thepost, voteStatus: 'NONE' } as PostType;
    },
    comments: async (root, args, context) => {
      const comments = await Comment.find({ post: args.post }).lean();
      if (!context.currentUser) {
        return comments as CommentType[];
      }

      const finalComments = comments.map((comment) => {
        const votingResult = comment.votes.find(
          (id) => id.toString() === context.currentUser._id.toString(),
        );
        if (votingResult) {
          return { ...comment, voteStatus: 'UP' };
        }
        return { ...comment, voteStatus: 'NONE' };
      });
      return finalComments as CommentType[];
    },
    comment: async (root, args) => Comment.findById(args._id),
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

      const uploadResult = await uploadImage(await args.avatar);
      const theavatar = (uploadResult?.url && uploadResult?.public_id)
        ? { url: uploadResult.url, public_id: uploadResult.public_id }
        : { url: undefined, public_id: undefined };

      const hashedPassword = await bcrypt.hash(args.password, 10);

      try {
        const newUser = new User(
          {
            username: args.username,
            password: hashedPassword,
            avatar: theavatar,
          },
        );
        return await newUser.save();
      } catch (error) {
        throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT' } });
      }
    },
    editBasicUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const oldUser = await User.findById(args._id);

      if (!oldUser) {
        throw new GraphQLError('user doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (oldUser._id.toString() !== context.currentUser._id.toString()) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      // User wants to change username
      if (oldUser.username !== args.username) {
        const existingUsername = await User.findOne({ username: args.username });
        if (existingUsername) {
          throw new GraphQLError('username already exists', { extensions: { code: 'BAD_USER_INPUT' } });
        }
        oldUser.username = args.username;
      }

      oldUser.bio = args.bio;

      const oldAvatarPublicId = oldUser?.avatar?.public_id;
      const uploadResult = await uploadImage(await args.avatar);
      const theavatar = (uploadResult?.url && uploadResult?.public_id)
        ? { url: uploadResult.url, public_id: uploadResult.public_id }
        : { url: undefined, public_id: undefined };

      if (oldAvatarPublicId) {
        // Old avatar exists
        if (theavatar?.public_id) {
          // New avatar exists -> Delete old
          await destroyImage(oldAvatarPublicId);
          oldUser.avatar = theavatar;
        }
      } else {
        // Old avatar doesnt exist
        oldUser.avatar = theavatar;
      }

      return oldUser.save();
    },
    editPasswordUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const oldUser = await User.findById(args._id);

      if (!oldUser) {
        throw new GraphQLError('user doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (oldUser._id.toString() !== context.currentUser._id.toString()) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (!(await bcrypt.compare(args.old_password, oldUser.password))) {
        throw new GraphQLError('incorrect credentials', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (args.password !== args.password_confirm) {
        throw new GraphQLError("passwords don't match", { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      oldUser.password = hashedPassword;

      return oldUser.save();
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
    editPost: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const oldPost = await Post.findById(args._id);

      if (!oldPost) {
        throw new GraphQLError('post doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (oldPost.author.toString() !== context.currentUser._id.toString()) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      oldPost.title = args.title;
      oldPost.body = args.body;

      return oldPost.save() as Promise<PostType>;
    },
    votePost: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const thePost = await Post.findById(args._id);

      if (!thePost) {
        throw new GraphQLError('post doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const voteFound = thePost.votes.findIndex(
        (userId) => userId.toString() === context.currentUser._id.toString(),
      );

      console.log(args.voteStatus);

      if (args.voteStatus === 'NONE') {
        // User wants to remove a vote
        if (voteFound === -1) {
          // There is no vote to remove
          return null;
        }
        // There is a vote and it will be removed
        const updatedPost = await Post.findOneAndUpdate(
          { _id: args._id },
          { $pullAll: { votes: [context.currentUser._id] }, $inc: { voteCount: -1 } },
          { new: true, runValidators: true, context: 'query' },
        ).lean();

        return {
          ...updatedPost,
          voteStatus: 'NONE',
        } as PostType;
      // eslint-disable-next-line no-else-return
      } else if (args.voteStatus === 'UP') {
        // User wants to vote
        if (voteFound === -1) {
          // There is no vote and a vote will be added

          const updatedPost = await Post.findOneAndUpdate(
            { _id: args._id },
            { $push: { votes: context.currentUser._id }, $inc: { voteCount: 1 } },
            { new: true, runValidators: true, context: 'query' },
          ).lean();

          return {
            ...updatedPost,
            voteStatus: 'UP',
          } as PostType;
        }
        // There is already a vote
        return null;
      }
      return null;
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
    editComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const oldComment = await Comment.findById(args._id);

      if (!oldComment) {
        throw new GraphQLError('comment doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      if (oldComment.author.toString() !== context.currentUser._id.toString()) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      oldComment.body = args.body;

      return oldComment.save() as Promise<CommentType>;
    },
    voteComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authorized', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const theComment = await Comment.findById(args._id);

      if (!theComment) {
        throw new GraphQLError('comment doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const voteFound = theComment.votes.findIndex(
        (userId) => userId.toString() === context.currentUser._id.toString(),
      );

      console.log(args.voteStatus);

      if (args.voteStatus === 'NONE') {
        // User wants to remove a vote
        if (voteFound === -1) {
          // There is no vote to remove
          return null;
        }
        // There is a vote and it will be removed
        const updatedComment = await Comment.findOneAndUpdate(
          { _id: args._id },
          { $pullAll: { votes: [context.currentUser._id] }, $inc: { voteCount: -1 } },
          { new: true, runValidators: true, context: 'query' },
        ).lean();

        return {
          ...updatedComment,
          voteStatus: 'NONE',
        } as CommentType;
      // eslint-disable-next-line no-else-return
      } else if (args.voteStatus === 'UP') {
        // User wants to vote
        if (voteFound === -1) {
          // There is no vote and a vote will be added

          const updatedComment = await Comment.findOneAndUpdate(
            { _id: args._id },
            { $push: { votes: context.currentUser._id }, $inc: { voteCount: 1 } },
            { new: true, runValidators: true, context: 'query' },
          ).lean();

          return {
            ...updatedComment,
            voteStatus: 'UP',
          } as CommentType;
        }
        // There is already a vote
        return null;
      }
      return null;
    },
  },
};

export default resolvers;
