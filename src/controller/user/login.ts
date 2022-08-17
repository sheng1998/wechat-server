import { Response, Request, NextFunction } from 'express';
import { findByUsername } from '../../service/user';
import response from '../../utils/response';
import { createToken } from '../../utils/token';
import { cookie as cookieConfig } from '../../config/default.config';

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // 校验用户名
  if (!username) {
    return response.failure(res, { type: 'username' }, '请输入用户名!');
  }

  // 校验密码
  if (!password) {
    return response.failure(res, { type: 'password' }, '请输入密码!');
  }

  // 查找用户
  const user = await findByUsername(username, next);
  if (user === undefined) return;
  if (!user) {
    return response.failure(res, { type: 'username' }, '该用户不存在!');
  }

  // 生成token并设置cookie
  const token = createToken({ id: user.id, username });
  res.cookie('session_id', token, {
    maxAge: cookieConfig.maxAge,
    httpOnly: true,
  });

  // 响应请求
  response.success(res, user, {
    pick: ['username', 'avatar', 'id', 'privileges'],
  });
  next();
};

export default loginController;
