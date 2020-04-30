import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import JWT from 'jsonwebtoken';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { models } from '../database/models';
import { AuthenticationDirective } from './middleware/authentication';

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  debug: false,
  schemaDirectives: {
    authentication: AuthenticationDirective,
  },
  context: async ({ req }) => {
    const { headers: { authorization } } = req;
    if (typeof authorization !== typeof undefined) {
      const search = 'Bearer';
      const regEx = new RegExp(search, 'ig');
      const token = authorization.replace(regEx, '').trim();

      return JWT.verify(token, process.env.JWT_SECRET, (err, result) => {
        if (err) {
          throw new AuthenticationError('Invalid / Expired token, please login');
        }
        return models.User.findById(result._id)
          .then((user) => {
            if (!user) {
              throw new AuthenticationError('User not found');
            }
            return { user, models };
          });
      });
    }
    return { models };
  },
});
