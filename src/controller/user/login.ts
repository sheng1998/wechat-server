import { Response, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { findById, findByUsername } from '../../service/user';
import response from '../../utils/response';
import { createToken, verifyToken } from '../../utils/token';
import { cookie as cookieConfig } from '../../config/default.config';
import { md5, privDecrypt } from '../../utils/encrypt';

// 用户登录
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
    httpOnly: false,
  });

  // 响应请求
  response.success(res, user, {
    pick: ['username', 'avatar', 'id', 'privileges'],
  });
};

// 检查用户登录状态
const checkController = async (req: Request, res: Response) => {
  // 查找用户
  const user = await checkLoginState(req);
  if (!user) return response.failure(res, '', '请先登陆!');

  // 响应请求
  response.success(res, user, {
    pick: ['username', 'avatar', 'id', 'privileges'],
  });
};

// 退出登录
const logoutController = async (req: Request, res: Response) => {
  res.clearCookie('session_id');
  // 响应请求
  response.success(res, '', { message: '退出登录成功!' });
};

// 检查登录状态
async function checkLoginState(req: Request) {
  const { session_id } = req.cookies;

  // token不存在
  if (!session_id) return undefined;

  // 判断 token 是否有效
  let userId = '';
  try {
    const userInfo = verifyToken(session_id);
    userId = (userInfo as JwtPayload)?.id;
    // eslint-disable-next-line no-empty
  } catch {}
  if (!userId) return undefined;

  // 查找用户
  return await findById(userId);
}

export { loginController, checkController, logoutController, checkLoginState };
