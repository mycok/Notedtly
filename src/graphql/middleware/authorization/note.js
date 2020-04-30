import { ApolloError, ForbiddenError } from 'apollo-server-express';

export const noteAuthorization = async (id, user, models) => {
  const note = await models.Note.findById(id);
  if (!note) {
    throw new ApolloError('Note matching ID not found', 'DB_ERROR');
  }

  const isAuthorized = String(note.author._id) === String(user._id);
  if (!isAuthorized) {
    throw new ForbiddenError('You are not authorized to perform this action');
  }
};
