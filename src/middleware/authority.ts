import { Response, NextFunction } from 'express';
import CustomRequest from '../../typings/request';
import { checkLoginState } from '../controller/user/login';
import response from '../utils/response';

export default async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await checkLoginState(req);
  if (!user) return response.failure(res, '', '请先登陆!');
  req.user = user;
  next();
};
