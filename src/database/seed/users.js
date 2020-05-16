import bcrypt from 'bcrypt';
import { gravatar } from '../../utils/gavatar';
import logger from '../../utils/logger';

const faker = require('faker');

export const seedUsers = async () => {
  logger.info('....seeding users......');
  const users = [];
  const hash = await bcrypt.hash('password#55', 10);

  for (let index = 0; index < 10; index += 1) {
    const user = {
      username: faker.internet.userName(),
      password: hash,
      email: faker.internet.email(),
    };
    user.avatar = gravatar(user.email);
    users.push(user);
  }

  return users;
};
