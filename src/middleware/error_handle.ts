import { Response, Request, NextFunction } from 'express';
import saveErrorInfo from '../service/error';

export default async (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  await saveErrorInfo(error);
  response.status(500).json({ error: error.message });
};
