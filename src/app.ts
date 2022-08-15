import express from 'express';
import cookieParser from 'cookie-parser';
import { port } from '../config/default.config';
import dbConnect from './utils/db_connect';
import logger from './utils/logger';
import routes from './routes';
import ioConnection from './socket.io';

const app = express();

// 解析 application/json 请求格式
app.use(express.json());
// 解析 application/x-www-form-urlencoded 请求格式
app.use(express.urlencoded({ extended: true }));

// cookie 相关插件
app.use(cookieParser());

// 启动
const server = app.listen(port, async () => {
  logger.info(
    `仿微信聊天室后台服务已启动, 主页请访问: http://localhost:${port}`
  );
  await dbConnect();
  routes(app);
});

ioConnection(server);
