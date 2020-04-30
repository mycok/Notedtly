import { noteQueries, userQueries } from './queries';
import { authMutations, noteMutations } from './mutations';

export const resolvers = {
  Query: { ...noteQueries, ...userQueries },
  Mutation: { ...authMutations, ...noteMutations },
};
