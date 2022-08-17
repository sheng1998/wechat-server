import mongoose from 'mongoose';

const loggerSchema = new mongoose.Schema({
  ip: { type: String, default: '' },
  date: { type: String, default: '' },
  method: { type: String, default: '' },
  url: { type: String, default: '' },
  protocol: { type: String, default: '' },
  status: { type: Number, default: 200 },
  form: { type: String, default: '' },
  createAt: { type: Date, default: Date.now },
});

// 创建模板 执行之后会自动在mongodb中创建相应的模板
const LoggerModel = mongoose.model('Request-logger', loggerSchema);

export default LoggerModel;
