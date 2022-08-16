import { RequestLogger } from '../../typings/logger';
import LoggerModel from '../model/logger.model';

// 保存请求日志
const createRequestLogger = async (logger: RequestLogger) => {
  try {
    const loggerModel = new LoggerModel(logger);
    return await loggerModel.save();
  } catch (err) {
    return null;
  }
}

export { createRequestLogger };
