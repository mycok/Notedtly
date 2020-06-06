import { Types } from 'mongoose';
import { ApolloError } from 'apollo-server-express';

import { handleErrorMessages } from '../../../utils/dbErrorHandler';
import { noteAuthorization } from '../../middleware/authorization/note';

export const noteMutations = {
  newNote: async (obj, { content }, { user, models }) => {
    let note;
    let err;
    try {
      note = await models.Note.create({
        content,
        author: Types.ObjectId(user._id),
      });
    } catch (error) {
      err = error;
      const errMsg = handleErrorMessages(error);
      throw new ApolloError(errMsg, 'DB_ERROR');
    } finally {
      if (!err) {
        await models.User.findByIdAndUpdate(user._id, { $push: { notes: note._id } });
      }
    }
    return note;
  },
  updateNote: async (obj, { id, content }, { user, models }) => {
    await noteAuthorization(id, user, models);

    const updatedNote = models.Note.findByIdAndUpdate(
      id, { content },
      { new: true, omitUndefined: true },
    );
    return updatedNote;
  },
  deleteNote: async (obj, { id }, { user, models }) => {
    await noteAuthorization(id, user, models);

    await models.Note.findByIdAndDelete(id);
    return { success: true };
  },
  // TODO:
  // - test id equality using ObjectId instead
  toggleFavorite: async (obj, { id }, { user, models }) => {
    // check if the current user has already favorited this particular note
    const note = await models.Note.findById(id);
    const isFavorited = note.favoritedBy.some((entry) => String(entry._id) === String(user._id));
    // prevent a user from favorating their own note
    if (String(note.author._id) === String(user._id)) {
      throw new ApolloError('You cannot favorite your own note');
    }
    // if the user has already favorited the note,
    //  remove them from the list and decrement the favorite count
    let updatedNote;
    if (isFavorited) {
      updatedNote = await models.Note.findByIdAndUpdate(id,
        {
          $pull: {
            favoritedBy: Types.ObjectId(user._id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          new: true,
        })
        .populate('author')
        .populate('favoritedBy');
    } else {
      updatedNote = await models.Note.findByIdAndUpdate(id,
        {
          $push: {
            favoritedBy: Types.ObjectId(user._id),
          },
          $inc: {
            favoriteCount: 1,
          },
        }, {
          new: true,
        })
        .populate('author')
        .populate('favoritedBy');
    }

    return updatedNote;
  },
};
