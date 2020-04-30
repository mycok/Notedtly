import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { generateToken } from '../../../utils/generateToken';
import { authValidation } from '../../../utils/validation';
import { handleErrorMessages } from '../../../utils/dbErrorHandler';

export const authMutations = {
  signUp: async (obj, { username, email, password }, { models }) => {
    const validationErrors = authValidation(email, password);

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
    const validationErrors = authValidation(email, password);

    if (Object.keys(validationErrors).length > 0) {
      throw new UserInputError(
        'SignIn failed due to validation errors',
        { validationErrors },
      );
    }

    const user = await models.User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Email doesnot exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Passwords dont match');
    }

    const token = generateToken(user._id);
    return { user, token };
  },
};
