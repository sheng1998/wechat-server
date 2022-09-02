// 收到客户端消息并转发
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { nanoid } from 'nanoid';
import { UserDocument } from '../../typings/user';
import { message as postMessage } from '../service/socket';
import Message from '../../typings/socket';

// 收到客户端的消息
export default async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  data: Message,
  userInfo: UserDocument | null,
  userMap: Map<any, any>
) => {
  console.log('服务端收到客户端的消息: ', data);
  const { receive_user_id, message, type, send_user_id } = data;
  const id = nanoid();
  // TODO 判断uid、gid是否存在数据库
  // 将信息保存到数据库(聊天记录)
  // if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
  await postMessage({
    id: userInfo?.id || '',
    send_user_id,
    receive_user_id,
    message,
    type,
    object: 'personal',
  });
  // }
  // 判断接受方是否在线（如果在线就直接转发）
  if (userMap.has(receive_user_id)) {
    const connections = userMap.get(receive_user_id);
    // 自己发给自己(文件传输助手)
    if (receive_user_id === userInfo?.id) {
      socket.emit('message', data);
    } else {
      for (let i = 0; i < connections.length; i += 1) {
        socket.to(connections[i]).emit('message', {
          id,
          send_user_id: userInfo?.id,
          receive_user_id: send_user_id,
          message,
          type,
          time: Date.now(),
        });
      }
    }
  }
  // TODO 群聊
};
