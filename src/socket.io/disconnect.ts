// socket 断开连接相关逻辑
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { disconnect } from '../service/socket';

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  uid: string,
  userMap: Map<any, any>
): string[] | undefined => {
  if (uid && userMap.has(uid)) {
    const userConnect = userMap.get(uid) as string[];
    userConnect.splice(
      userConnect.findIndex((item) => item === socket.id),
      1
    );
    // 保存数据到数据库（断开连接记录）
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      disconnect(socket.id);
    }
    return userConnect;
  }
};
