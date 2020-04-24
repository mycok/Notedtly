import { app, server } from './server';
import logger from './utils/logger';
import { dbConnection } from './database';

const port = process.env.PORT;
dbConnection(`${process.env.MONGODB_URI}`);

app.listen(port, () => {
  logger.info(`****GraphQL API running at http://localhost:${port}/${server.graphqlPath}******`);
});
