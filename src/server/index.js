import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import documentation from '../../swagger.json';

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
  Query: {
    hello: () => 'hello there!!',
  },
};

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(documentation));

const server = new ApolloServer({ typeDefs, resolvers, context: {} });
server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => {
  res.send('We are here!!!!');
});

export { app, server };
