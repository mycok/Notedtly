import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import documentation from '../../swagger.json';

const notesList = [
  {
    id: '1',
    content: 'This is a note',
    author: 'Adam Scott',
  },
  {
    id: '2',
    content: 'This is another note',
    author: 'Harlow Everly',
  },
  {
    id: '3',
    content: 'Oh hey look, another note!',
    author: 'Riley Harrison',
  },
];

const typeDefs = gql`
    type Note {
    id: ID,
    content: String,
    author: String 
  },
  type Query {
        hello: String
        notes: [Note]
        note(id: ID): Note
    },
    type Mutation {
      newNote(content: String!): Note
    }
`;

const resolvers = {
  Query: {
    hello: () => 'hello there!!',
    notes: () => notesList,
    note: (parent, args) => {
      notesList.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      const noteValue = {
        id: notesList.length + 1,
        content: args.cotent,
        author: 'Me',
      };
      notesList.push(noteValue);
      return noteValue;
    },
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
