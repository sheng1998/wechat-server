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
    const messageData: any = {
      user: data.id,
      message: data.message,
      type: data.type,
      object: data.object || 'personal',
    };
    if (data.object === 'group') {
      messageData.receiveGroup = data.receive_user_id;
    } else {
      messageData.receiveUser = data.receive_user_id;
    }
    const socketModel = new SocketMessageModel(messageData);
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
