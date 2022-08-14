import express from 'express';
import { port } from '../config/default.config';
import logger from './utils/logger';

const app = express();

app.use(express.json());

// 启动
app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
});
