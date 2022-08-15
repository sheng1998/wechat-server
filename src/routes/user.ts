import { Express, Router } from 'express';
import { routerConfig } from '../../config/default.config';
import { registerController } from '../controller/user';

const router = Router();

// 用户相关路由配置
const routers = [
  // 用户注册
  router.post('/register', registerController),
];

const userRouter = (app: Express) => {
  routers.forEach((item) => app.use(`${routerConfig.prefix}/user`, item));
};

export default userRouter;
