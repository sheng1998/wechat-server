import { Response, Request } from 'express';
import CustomRequest from '../../../typings/request';
import { findById, getUserList } from '../../service/user';
import response from '../../utils/response';
import { checkController, loginController, logoutController } from './login';
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

// 获取用户列表
const getUserListController = async (req: CustomRequest, res: Response) => {
  if (!req.user) return;
  // 查找用户
  const userList = (await getUserList(req.user.id)) || [];
  const result = [];

  // 过滤其他属性
  for (let i = 0; i < userList.length; i += 1) {
    const { username, avatar, id, privileges } = userList[i];
    result.push({ username, avatar, id, privileges });
  }

  // 响应请求
  response.success(res, result);
};

export {
  userInfoController,
  checkController,
  loginController,
  logoutController,
  registerController,
  getUserListController,
};
