import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { port } from './config/default.config';
import dbConnect from './utils/db_connect';
import corsOptionsDelegate from './utils/cors_options_delegate';
import router from './router';
import ioConnection from './socket.io';
import errorHandle from './middleware/error_handle';
import loggerFormat from './utils/logger_format';
import { createStartLogger } from './service/logger';

const app = express();

// 配置跨域（必须要在挂载路由前配置）
app.use(cors(corsOptionsDelegate));

// 连接数据库
dbConnect();

// 配置日志处理中间件
app.use(morgan('combined', { stream: { write: loggerFormat } }));
// 解析 application/json 请求格式
app.use(express.json());
// 解析 application/x-www-form-urlencoded 请求格式
app.use(express.urlencoded({ extended: true }));
// cookie 相关插件
app.use(cookieParser());

// 挂载路由
app.use('/api/v1', router);

// 错误处理中间件
app.use(errorHandle);

// 启动
const server = app.listen(port, () => {
  if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
    createStartLogger();
  }
  console.log(
    `仿微信聊天室后台服务已启动, 主页请访问: http://localhost:${port}`
  );
});

ioConnection(server);
