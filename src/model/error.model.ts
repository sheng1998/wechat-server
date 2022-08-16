import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema(
  {
    message: { type: String, default: '' },
    error: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// 创建模板 执行之后会自动在mongodb中创建相应的模板
const ErrorModel = mongoose.model('Error', errorSchema);

export default ErrorModel;
