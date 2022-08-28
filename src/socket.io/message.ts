// 收到客户端消息并转发
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { UserDocument } from '../../typings/user';
import { message as postMessage } from '../service/socket';

// 收到客户端的消息
export default async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  data: any,
  userInfo: UserDocument | null,
  userMap: Map<any, any>
) => {
  console.log('服务端收到客户端的消息: ', data);
  const { uid, message, type, gid } = data;
  // 将信息保存到数据库(聊天记录)
  if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
    await postMessage({
      id: userInfo?.id || '',
      uid,
      gid,
      message,
      type,
    });
  }
  // 判断接受方是否在线（如果在线就直接转发）
  if (userMap.has(uid)) {
    const connections = userMap.get(uid);
    if (uid === userInfo?.id) {
      socket.emit('message', data);
    }
    for (let i = 0; i < connections.length; i += 1) {
      socket
        .to(connections[i])
        .emit('message', { uid: userInfo?.id, message, type });
    }
  }
  // TODO 群聊
};
