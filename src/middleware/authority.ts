import { Response, Request, NextFunction } from 'express';
import { checkLoginState } from '../controller/user/login';
import response from '../utils/response';

export default async (req: Request, res: Response, next: NextFunction) => {
  const user = await checkLoginState(req);
  if (!user) return response.failure(res, '', '请先登陆!');
  next();
};
