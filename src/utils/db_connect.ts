import mongoose from 'mongoose';
import { mongoose as config } from '../config/default.config';

export default async () => {
  try {
    const connection = await mongoose.connect(config.url, config.options);
    console.log('数据库连接成功!');
    return connection;
  } catch (error) {
    console.log(error);
    console.error('数据库连接失败!');
    process.exit(1);
  }
};
