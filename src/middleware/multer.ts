import multer from 'multer';
import { Response, NextFunction } from 'express';
import { resolve } from 'path';
import CustomRequest from '../../typings/request';
import { uploadBaseDir } from '../config/default.config';

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  // 临时文件存储地址
  const destination = resolve(uploadBaseDir, '~', req.user?.id || '');
  // 创建仓库
  const storage = multer.diskStorage({ destination });
  const upload = multer({ storage }).single('chunk');
  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};
