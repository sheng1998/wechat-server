import { Router } from 'express';
import { loginController, registerController } from '../controller/user';

const router = Router();

// 用户注册
router.post('/register', registerController);
// 用户登录
router.post('/login', loginController);

export default router;
