import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import JWT from 'jsonwebtoken';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { models } from '../database/models';

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  debug: false,
  context: async ({ req }) => {
    const { headers: { authorization } } = req;
    if (typeof authorization !== typeof undefined) {
      const search = 'Bearer';
      const regEx = new RegExp(search, 'ig');
      const token = authorization.replace(regEx, '').trim();

      return JWT.verify(token, process.env.JWT_SECRET, (err, result) => {
        if (err) {
          throw new AuthenticationError('invalid token');
        }
        return models.User.findById(result._id)
          .then((user) => {
            if (!user) {
              throw new AuthenticationError('user not found');
            }
            return { user, models };
          });
      });
    }
    return { models };
  },
});
