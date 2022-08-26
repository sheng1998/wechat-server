import { Router } from 'express';
import {
  checkController,
  getUserListController,
  loginController,
  registerController,
  userInfoController,
} from '../controller/user';

const router = Router();

// 获取用户信息
router.get('/', userInfoController);
// 用户注册
router.post('/register', registerController);
// 用户登录
router.post('/login', loginController);
// 检查用户登录状态
router.get('/check', checkController);
// 获取用户列表
// TODO 校验登陆的中间件
router.get('/list', getUserListController);

export default router;
