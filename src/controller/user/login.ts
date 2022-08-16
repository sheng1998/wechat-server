import { Response, Request, NextFunction } from 'express';
import response from '../../utils/response';

const loginController = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username) {
    response.failure(res, { type: 'username' }, '请输入用户名!');
  } else if (!password) {
    response.failure(res, { type: 'password' }, '请输入密码!');
  }
  response.success(res, { ip: req.ip, username, password });
  next();
};

export default loginController;
