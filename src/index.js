import { app, server } from './server';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`****GraphQL API running at http://localhost:${port}/${server.graphqlPath}******`);
});
