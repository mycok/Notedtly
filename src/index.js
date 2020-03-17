import { app, server } from './server';
import logger from './utils/logger';

const port = process.env.PORT;

app.listen(port, () => {
  logger.info(`****GraphQL API running at http://localhost:${port}/${server.graphqlPath}******`);
});
