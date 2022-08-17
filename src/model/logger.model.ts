import mongoose from 'mongoose';

// 请求日志
const requestLoggerSchema = new mongoose.Schema({
  ip: { type: String, default: '' },
  date: { type: String, default: '' },
  method: { type: String, default: '' },
  url: { type: String, default: '' },
  protocol: { type: String, default: '' },
  status: { type: Number, default: 200 },
  form: { type: String, default: '' },
  createAt: { type: Date, default: Date.now },
});

const RequestLoggerModel = mongoose.model(
  'Request-logger',
  requestLoggerSchema
);

// 启动日志
const startLoggerSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
});

const StartLoggerModel = mongoose.model('Start-logger', startLoggerSchema);

export { RequestLoggerModel, StartLoggerModel };
