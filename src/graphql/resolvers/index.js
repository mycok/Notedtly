import {
  noteQueries, userQueries, userTypeResolvers, noteTypeResolvers,
} from './queries';
import { authMutations, noteMutations } from './mutations';

export const resolvers = {
  Query: { ...noteQueries, ...userQueries },
  Mutation: { ...authMutations, ...noteMutations },
  User: { ...userTypeResolvers },
  Note: { ...noteTypeResolvers },
};
