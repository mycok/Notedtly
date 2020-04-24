import mongoose from 'mongoose';

import logger from '../utils/logger';

export const dbConnection = (mongoUri) => {
  mongoose.Promise = global.Promise;

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  mongoose.connect(mongoUri)
    .catch((err) => {
      logger.error(`-----Unable to connect to database: ${err}-----`);
      process.exit();
    });

  mongoose.connection.on('connected', () => {
    logger.info('-----database connection successfully established-----');
  });
};

export const close = async () => {
  mongoose.connection.close(() => {
    logger.info('.....database connection closed.....');
  });
};
