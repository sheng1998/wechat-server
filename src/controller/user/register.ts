import { Response, Request } from 'express';
import {
  username as usernameValidate,
  password as passwordValidate,
} from '../../utils/validate';
import { create, findByUsername } from '../../service/user';
import response from '../../utils/response';
import { createToken } from '../../utils/token';
import { cookie as cookieConfig } from '../../config/default.config';
import { md5, privDecrypt } from '../../utils/encrypt';

const registerController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 校验用户名
  let failureMessage = usernameValidate(username);
  if (failureMessage) {
    return response.failure(res, { type: 'username' }, failureMessage);
  }

  // 校验密码
  if (!password) {
    return response.failure(res, { type: 'password' }, '请输入密码!');
  }
  /**
   * 尝试解密字符串
   * 用privDecrypt方法解密，解密失败为null，表示密码没有经过加密，或者加密格式不对
   * 解密失败就用原来字符串作校验
   */
  failureMessage = passwordValidate(privDecrypt(password) || password);
  if (failureMessage) {
    return response.failure(res, { type: 'password' }, failureMessage);
  }

  // 判断用户名是否存在用户表中（用户名禁止重复）
  let user = await findByUsername(username);
  if (user) {
    return response.failure(
      res,
      { type: 'username' },
      '用户已存在，请更换用户名重试!'
    );
  }

  // 创建用户
  user = await create({
    username: username as string,
    // 密码必须加密
    password: md5(password as string),
    privileges: 1,
  });

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
};

export default registerController;
