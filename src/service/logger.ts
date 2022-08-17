import { RequestLogger } from '../../typings/logger';
import { RequestLoggerModel, StartLoggerModel } from '../model/logger.model';

// 保存请求日志
const createRequestLogger = async (logger: RequestLogger) => {
  try {
    const loggerModel = new RequestLoggerModel(logger);
    return await loggerModel.save();
  } catch (err) {
    return null;
  }
};

// 保存启动日志
const createStartLogger = async () => {
  try {
    const loggerModel = new StartLoggerModel();
    return await loggerModel.save();
  } catch (err) {
    return null;
  }
};

export { createRequestLogger, createStartLogger };
