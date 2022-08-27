import mongoose, { Schema } from 'mongoose';
import Group from './group.model';
import User from './user.model';

const socketConnectSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
  socketId: { type: String, required: true },
  connectTime: { type: Date, default: Date.now },
  disconnectTime: { type: Date },
});

const socketMessageSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
  receiveUser: { type: Schema.Types.ObjectId, ref: User }, // 私聊
  receiveGroup: { type: Schema.Types.ObjectId, ref: Group }, // 群聊
  message: { type: String, required: true },
  type: { type: String, default: 'text' },
  object: { type: String, enum: ['personal', 'group'], default: 'personal' },
  createdAt: { type: Date, default: Date.now },
});

const SocketConnectModel = mongoose.model(
  'Socket-connect',
  socketConnectSchema
);

const SocketMessageModel = mongoose.model(
  'Socket-message',
  socketMessageSchema
);

export { SocketConnectModel, SocketMessageModel };
