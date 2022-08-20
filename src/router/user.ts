import { Router } from 'express';
import {
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

export default router;
