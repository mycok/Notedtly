import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

export class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const { user } = args[2];
      if (user) {
        const response = await resolve.apply(this, args);
        return response;
      }
      throw new AuthenticationError('You need to login');
    };
  }
}
