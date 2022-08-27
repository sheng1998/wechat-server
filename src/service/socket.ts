import { NextFunction } from 'express';
import Message from '../../typings/socket';
import { SocketConnectModel, SocketMessageModel } from '../model/socket.model';
import saveErrorInfo from './error';

// socket连接成功
const connection = async (uid: string, sid: string, next?: NextFunction) => {
  try {
    const socketModel = new SocketConnectModel({
      user: uid,
      socketId: sid,
    });
    return await socketModel.save();
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

// socket断开连接
const disconnect = async (sid: string, next?: NextFunction) => {
  try {
    return await SocketConnectModel.findOneAndUpdate(
      {
        socketId: sid,
      },
      {
        disconnectTime: new Date(),
      }
    );
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

// 发送消息
const message = async (data: Message, next?: NextFunction) => {
  try {
    const socketModel = new SocketMessageModel({
      user: data.id,
      receiveUser: data.uid ? data.uid : null,
      receiveGroup: data.gid ? data.gid : null,
      message: data.message,
      type: data.type,
      object: data.uid ? 'personal' : 'group',
    });
    return await socketModel.save();
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

export { connection, disconnect, message };
