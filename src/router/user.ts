import { Router } from 'express';
import authority from '../middleware/authority';
import {
  checkController,
  getUserListController,
  loginController,
  logoutController,
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
// 退出登录
router.get('/logout', logoutController);
// 检查用户登录状态
router.get('/check', checkController);
// 获取用户列表
router.get('/list', authority, getUserListController);

export default router;
