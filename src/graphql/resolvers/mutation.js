import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { generateToken } from '../../utils/generateToken';
import { emailRegex, passwordRegex } from '../../utils/validation';
import { handleErrorMessages } from '../../utils/dbErrorHandler';

const validate = (email, password) => {
  const validationErrors = {};

  if (!emailRegex(email)) {
    validationErrors.emailError = 'Please provide a valid email';
  }
  if (!passwordRegex(password)) {
    validationErrors.passwordError = 'Password should be atleat 8 characters long with a lowercase, uppercase, number and a special character';
  }

  return validationErrors;
};

export const Mutation = {
  newNote: async (obj, { content }, { models }) => {
    // TODO
    // add validation, and custom error handling
    const newNote = { content, author: 'michael' };
    const note = await models.Note.create(newNote);

    return note;
  },
  updateNote: async (obj, { id, content }, { models }) => {
    const updatedNote = models.Note.findByIdAndUpdate(
      id, { content },
      { new: true, omitUndefined: true },
    );
    return updatedNote;
  },
  deleteNote: async (obj, { id }, { models }) => {
    const deleted = await models.Note.findByIdAndDelete(id);
    if (deleted) return { success: true };
    return { success: false };
  },
  signUp: async (obj, { username, email, password }, { models }) => {
    const validationErrors = validate(email, password);

    if (Object.keys(validationErrors).length > 0) {
      throw new UserInputError(
        'signUp failed due to validation errors',
        { validationErrors },
      );
    }

    const hash = await bcrypt.hash(password, 10);

    try {
      const user = await models.User.create({
        username,
        email,
        password: hash,
      });
      return generateToken(user._id);
    } catch (error) {
      const errMsg = handleErrorMessages(error);
      throw new ApolloError(errMsg, 'DB_ERROR');
    }
  },
  signIn: async (obj, { email, password }, { models }) => {
    const validationErrors = validate(email, password);

    if (Object.keys(validationErrors).length > 0) {
      throw new UserInputError(
        'signIn failed due to validation errors',
        { validationErrors },
      );
    }

    const user = await models.User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('email doesnot exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('invalid password');
    }

    const token = generateToken(user._id);
    return { user, token };
  },
};
