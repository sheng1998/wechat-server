import mongoose, { Schema } from 'mongoose';
import User from './user.model';

const groupSchema = new mongoose.Schema({
  owner: { type: Schema.Types.ObjectId, ref: User, required: true }, // 创建者
  administrators: [{ type: Schema.Types.ObjectId, ref: User }], // 管理员
  member: [{ type: Schema.Types.ObjectId, ref: User }], // 普通成员
  notice: { type: String, default: '' }, // 公告
  createdAt: { type: Date, default: Date.now },
});

const GroupModel = mongoose.model('Group', groupSchema);

export default GroupModel;
