import assert from 'assert';
import mongoose from 'mongoose';

import { expect } from '../setup';
import { dbConnection } from '../../src/database';
import { signUp } from '../setup/queries/auth/signUp';
import { signIn } from '../setup/queries/auth/signIn';
import { me } from '../setup/queries/auth/me';

const baseUrl = '/api';

describe('User authentication', () => {
  let token;
  const db = mongoose.connection;
  before(() => {
    dbConnection(`${process.env.MONGODB_URI}`);
  });
  after(async () => {
    await db.models.User.deleteMany({});
  });

  context('when a user provides all valid values required for signUp ', () => {
    it('he / she should successfully signUp', async () => {
      const res = await signUp(baseUrl, {
        username: 'test-user',
        email: 'test@now.com',
        password: 'testPass#4',
      });

      assert(typeof res.body.data.signUp === 'string');
    });
  });

  context('when a user provides invalid email for signUp ', () => {
    it('should throw a UserInputError', async () => {
      const res = await signUp(baseUrl, {
        username: 'test-user',
        email: 'testnow.com',
        password: 'testPass#4',
      });

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].extensions.validationErrors.emailError).to.equal('Please provide a valid email');
    });
  });

  context('when a user provides invalid password for signUp ', () => {
    it('should throw a UserInputError', async () => {
      const res = await signUp(baseUrl, {
        username: 'test-user',
        email: 'test@now.com',
        password: 'testPass',
      });

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].extensions.validationErrors.passwordError).to.equal(
        'Password should be atleat 8 characters long with a lowercase, uppercase, number and a special character',
      );
    });
  });

  context('when a user provides invalid username length for signUp ', () => {
    it('should throw an ApolloError', async () => {
      const res = await signUp(baseUrl, {
        username: 't',
        email: 'test@now.com',
        password: 'testPass#4',
      });

      const response = JSON.parse(res.text);

      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Path `username` (`t`) is shorter than the minimum allowed length (2).');
    });
  });

  context('when a user provides all valid values required for signIn ', () => {
    it('he/she should successfully signIn', async () => {
      const res = await signIn(baseUrl, {
        email: 'test@now.com',
        password: 'testPass#4',
      });
      token = res.body.data.signIn.token;

      expect(res.body.data.signIn.user.email).to.be.equal('test@now.com');
      assert(typeof res.body.data.signIn.token === 'string');
    });
  });

  context('when a user provides invalid email for signIn ', () => {
    it('should throw a UserInputError', async () => {
      const res = await signIn(baseUrl, {
        email: 'testnow.com',
        password: 'testPass#4',
      });

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].extensions.validationErrors.emailError).to.equal('Please provide a valid email');
    });
  });

  context('when a user provides invalid password for signIn ', () => {
    it('should throw a UserInputError', async () => {
      const res = await signIn(baseUrl, {
        email: 'test@now.com',
        password: 'testPass',
      });

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].extensions.validationErrors.passwordError).to.equal(
        'Password should be atleat 8 characters long with a lowercase, uppercase, number and a special character',
      );
    });
  });

  context('when a user provides a valid but non existant email for signIn ', () => {
    it('should throw an AuthenticationError', async () => {
      const res = await signIn(baseUrl, {
        email: 'myco@gmail.com',
        password: 'testPass#4',
      });

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Email doesnot exist');
    });
  });

  context('when a user provides a valid but non matching password for signIn ', () => {
    it('should throw an AuthenticationError', async () => {
      const res = await signIn(baseUrl, {
        email: 'test@now.com',
        password: 'testPass#45',
      });

      const response = JSON.parse(res.text);
      expect(response).to.have.property('errors');
      expect(response.errors[0].message).to.equal('Passwords dont match');
    });
  });

  context('when a user queries for his/her authenticated data', () => {
    it('should successfully retrieve the user data', async () => {
      const res = await me(baseUrl, token);

      expect(res.body.data.me.email).to.be.equal('test@now.com');
    });
  });
});
