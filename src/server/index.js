import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import { server } from '../graphql';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.applyMiddleware({ app, path: '/api' });

export { app, server };
