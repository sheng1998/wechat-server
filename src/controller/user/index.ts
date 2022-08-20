import { Response, Request } from 'express';
import { findById } from '../../service/user';
import response from '../../utils/response';
import { checkController, loginController } from './login';
import registerController from './register';

// 获取用户信息
const userInfoController = async (req: Request, res: Response) => {
  const { uid } = req.body;

  if (!uid) {
    return response.failure(res, '', '请输入用户名!');
  }

  // 查找用户
  const user = await findById(uid);
  if (!user) {
    return response.failure(res, '', '该用户不存在!');
  }

  // 响应请求
  response.success(res, user, {
    pick: ['username', 'avatar', 'id', 'privileges'],
  });
};

export {
  userInfoController,
  checkController,
  loginController,
  registerController,
};
