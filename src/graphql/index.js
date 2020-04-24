import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { models } from '../database/models';

export const server = new ApolloServer({ typeDefs, resolvers, context: { models } });
