import { Response, Request, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { findById } from '../service/user';
import response from '../utils/response';
import { verifyToken } from '../utils/token';

export default async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line camelcase
  const { session_id } = req.cookies;

  // token不存在
  // eslint-disable-next-line camelcase
  if (!session_id) {
    return response.failure(res, '', '请先登陆!');
  }

  // 判断 token 是否有效
  let userId = '';
  try {
    const userInfo = verifyToken(session_id);
    userId = (userInfo as JwtPayload)?.id;
    if (!userId) return response.failure(res, '', '请先登陆!');
  } catch (error) {
    return response.failure(res, '', '请先登陆!');
  }

  // 查找用户
  const user = await findById(userId);
  if (!user) {
    return response.failure(res, '', '请先登陆!');
  }
  next();
};
