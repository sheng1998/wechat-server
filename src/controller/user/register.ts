import { Response, Request, NextFunction } from 'express';
import lodash from 'lodash';
import {
  username as usernameValidate,
  password as passwordValidate,
} from '../../utils/validate';
import { create, findByUsername } from '../../service/user';
import response from '../../utils/response';
import { createToken } from '../../utils/token';

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // 校验用户名
  let failureMessage = usernameValidate(username);
  if (failureMessage) {
    response.failure(res, { type: 'username' }, failureMessage);
    return;
  }

  // 校验密码
  failureMessage = passwordValidate(password);
  if (failureMessage) {
    response.failure(res, { type: 'password' }, failureMessage);
    return;
  }

  // 判断用户名是否存在用户表中（用户名禁止重复）
  let user = await findByUsername(username);
  if (user) {
    response.failure(
      res,
      { type: 'username' },
      '用户已存在，请更换用户名重试!'
    );
    return;
  }

  // 创建用户
  user = await create({
    username: username as string,
    password: password as string,
  });

  // 注册失败
  if (!user) {
    response.failure(res, null, '注册失败!');
    return;
  }

  // 生成token并设置cookie
  const token = createToken({ id: user.id, username });
  res.cookie('session_id', token, { maxAge: 60 * 24 * 2, httpOnly: true });

  // 响应请求
  response.success(res, lodash.pick(user, ['username', 'password', 'id']));
  next();
};

export default registerController;
