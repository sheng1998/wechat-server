import { Response, Request } from 'express';
import { findByUsername } from '../../service/user';
import response from '../../utils/response';
import { createToken } from '../../utils/token';
import { cookie as cookieConfig } from '../../config/default.config';
import { md5, privDecrypt } from '../../utils/encrypt';

const loginController = async (req: Request, res: Response) => {
  // eslint-disable-next-line prefer-const
  let { username, password } = req.body;

  // 校验用户名
  if (!username) {
    return response.failure(res, { type: 'username' }, '请输入用户名!');
  }

  // 校验密码
  /**
   * 尝试解密字符串
   * 用privDecrypt方法解密，解密失败为null，表示密码没有经过加密，或者加密格式不对
   * 解密失败就用原来字符串作校验
   */
  password = privDecrypt(password) || password;
  if (!password) {
    return response.failure(res, { type: 'password' }, '请输入密码!');
  }

  // 查找用户
  const user = await findByUsername(username);
  if (!user) {
    return response.failure(res, { type: 'username' }, '该用户不存在!');
  }

  // 校验密码是否正确
  if (md5(password) !== user.password) {
    return response.failure(res, { type: 'password' }, '密码错误!');
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
};

export default loginController;
