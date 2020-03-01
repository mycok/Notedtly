import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

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
const server = new ApolloServer({ typeDefs, resolvers, context: {} });
server.applyMiddleware({ app, path: '/api' });

app.get('*', (req, res) => {
  res.send('We are here!!!!');
});

export { app, server };
