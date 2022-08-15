import express from 'express';
import { port } from '../config/default.config';
import dbConnect from './utils/db_connect';
import logger from './utils/logger';
import ioConnection from './socket.io';

const app = express();

app.use(express.json());

// 启动
const server = app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await dbConnect();
});

ioConnection(server);
