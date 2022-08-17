import util from 'util';
import ErrorModel from '../model/error.model';

// 保存错误信息
export default async (error: Error) => {
  try {
    const errorModel = new ErrorModel({
      message: error.message,
      error: util.format(error),
    });
    return await errorModel.save();
  } catch (err) {
    return null;
  }
};
