import mongoose from 'mongoose';

import { close } from '../../src/database';
import { expect } from '../setup';
import { fetchUserByUsername } from '../setup/queries/user/user';
import { fetchAllUsers } from '../setup/queries/user/users';

const baseUrl = '/api';

describe('User CRUD', () => {
  const db = mongoose.connection;
  let user;
  before(async () => {
    const newUser = await db.models.User.create({
      username: 'test-user',
      email: 'test@now.com',
      password: 'testPass#4',
    });
    user = newUser;
  });
  after((done) => {
    db.models.User.deleteMany({})
      .then(() => {
        close();
      });
    done();
  });

  context('when we query a user by username', () => {
    it('should return a user matching the provided username', async () => {
      const res = await fetchUserByUsername(baseUrl, { username: user._doc.username });

      expect(res.body.data.user.username).to.be.equal(user.username);
    });
  });

  context('when we query for all users', () => {
    it('should return an array of user objects', async () => {
      const res = await fetchAllUsers(baseUrl);

      expect(res.body.data.users.length).to.be.equal(1);
    });
  });
});
