// 收到客户端消息并转发
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { nanoid } from 'nanoid';
import { TripleDES, enc } from 'crypto-js';
import { UserDocument } from '../../typings/user';
import { message as postMessage } from '../service/socket';
import Message from '../../typings/socket';

// 解密消息
// eslint-disable-next-line max-len
const decrypt = (string: string) => {
  try {
    return TripleDES.decrypt(string, 'sBUoieHX').toString(enc.Utf8);
  } catch (error) {
    return undefined;
  }
};

// 收到客户端的消息
export default async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  data: Message,
  userInfo: UserDocument | null,
  userMap: Map<any, any>
) => {
  // TODO 解密失败推送错误
  console.log('服务端收到客户端的消息: ', {
    ...data,
    message: decrypt(data.message),
  });
  const { receive_user_id, message, type, send_user_id } = data;
  const id = nanoid();
  // TODO 判断uid、gid是否存在数据库
  // 将信息保存到数据库(聊天记录)
  // if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
  await postMessage({
    id: userInfo?.id || '',
    send_user_id,
    receive_user_id,
    message: decrypt(message) || message,
    type,
    object: 'personal',
  });
  // }
  // 判断接受方是否在线（如果在线就直接转发）
  if (userMap.has(receive_user_id)) {
    const connections = userMap.get(receive_user_id);
    if (receive_user_id !== userInfo?.id) {
      for (let i = 0; i < connections.length; i += 1) {
        socket.to(connections[i]).emit('message-private', {
          ...data,
          id,
          time: Date.now(),
        });
      }
    }
  }
  // TODO 群聊
  // 考虑多端同时在线的情况下，需要给每个自己发送一次消息(除了当前自己)
  if (userMap.has(send_user_id)) {
    const connections = userMap.get(send_user_id);
    for (let i = 0; i < connections.length; i += 1) {
      if (connections[i] === socket.id) continue;
      // 同步消息到其他端(同一用户建立了多个连接)
      socket.to(connections[i]).emit('message-private-sync', {
        ...data,
        id,
        time: Date.now(),
      });
    }
  }
};
