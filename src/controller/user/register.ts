import { Response, Request, NextFunction } from 'express';
import {
  username as usernameValidate,
  password as passwordValidate,
} from '../../utils/validate';
import { create, findByUsername } from '../../service/user';
import response from '../../utils/response';
import { createToken } from '../../utils/token';
import { cookie as cookieConfig } from '../../config/default.config';

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // 校验用户名
  let failureMessage = usernameValidate(username);
  if (failureMessage) {
    return response.failure(res, { type: 'username' }, failureMessage);
  }

  // 校验密码
  failureMessage = passwordValidate(password);
  if (failureMessage) {
    return response.failure(res, { type: 'password' }, failureMessage);
  }

  // 判断用户名是否存在用户表中（用户名禁止重复）
  let user = await findByUsername(username, next);
  if (user === undefined) return;
  if (user) {
    return response.failure(
      res,
      { type: 'username' },
      '用户已存在，请更换用户名重试!'
    );
  }

  // 创建用户
  user = await create(
    {
      username: username as string,
      password: password as string,
      privileges: 1,
    },
    next
  );

  // 注册失败
  if (!user) return;

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

export default registerController;
