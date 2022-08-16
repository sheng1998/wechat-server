import { Request, Response, Router } from 'express';
import userRouter from './user';

const router = Router();

router.get('/', (req: Request, res: Response) =>
  res.status(200).send('欢迎访问仿微信聊天室后台！')
);
// 用户相关路由配置
router.use('/user', userRouter);

export default router;
