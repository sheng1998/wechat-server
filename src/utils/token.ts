import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '../../config/default.config';

// 创建token
const createToken = (data: string | object) => {
  const { secret, expiresIn } = jwtConfig;
  return jwt.sign(data, secret, { expiresIn });
};

// token解码
const verifyToken = (data: string) => {
  const { secret } = jwtConfig;
  return jwt.verify(data, secret);
};

export { createToken, verifyToken };
