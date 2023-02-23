import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';

import { makeExecutableSchema } from '@graphql-tools/schema';
// eslint-disable-next-line import/extensions
import { createApollo4QueryValidationPlugin, constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4.js';

import { type ICurrentUser } from './types';

import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import context from './context.js';

import './mongodb.js';

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers,
});

const app = express();
const httpServer = http.createServer(app);

export interface MyContext {
  // token?: string,
  currentUser: null | ICurrentUser
}
const server = new ApolloServer<MyContext>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    createApollo4QueryValidationPlugin({ schema }),
  ],
});
await server.start();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'production') app.use(express.static('front'));

app.use(
  '/graphql',
  expressMiddleware(server, {
    // context: async ({ req }) => ({ token: req.headers.token }),
    context,
  }),
);

const PORT = 4000;
// eslint-disable-next-line no-promise-executor-return
await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Listening on port ${PORT}`);
