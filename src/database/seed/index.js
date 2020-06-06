import { models } from '../models';
import { seedUsers } from './users';
import { seedNotes } from './notes';
import { dbConnection } from '..';
import logger from '../../utils/logger';

const DB_URI = process.env.MONGODB_URI;

const seed = async () => {
  dbConnection(DB_URI);

  setTimeout(async () => {
    logger.info('....seeding data....');
    models.User.create(await seedUsers())
      .then(async (users) => {
        models.Note.create(await seedNotes(users))
          .then(() => {
            logger.info('....seeding complete....');
            process.exit(0);
          });
      })
      .catch(() => {
        logger.error('....something is wrong...');
        process.exit(0);
      });
  }, 1000);
};

seed();
