import { Express, Request, Response } from 'express';
import userRouter from './user';

function routes(app: Express) {
  app.get('/', (req: Request, res: Response) =>
    res.status(200).send('欢迎访问仿微信聊天室后台！')
  );
  // 用户相关路由配置
  userRouter(app);
}

export default routes;
