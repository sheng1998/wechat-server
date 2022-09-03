// socket 连接相关操作
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserDocument } from '../../typings/user';
import message from './message';
import authority from './authority';
import disconnect from './disconnect';

export default function (server: HttpServer) {
  // const io = new Server(server, { cors: { origin: '*' } });
  const io = new Server(server);
  // 记录已经连接的用户ID
  const userMap = new Map();

  io.on('connection', async (socket) => {
    let userInfo: UserDocument | null = null;

    socket.on('error', (err) => {
      console.log(err);
    });

    // 权限校验
    try {
      userInfo = (await authority(socket, (user) => {
        const { id } = user;
        if (!userMap.has(id)) {
          userMap.set(id, [socket.id]);
        } else {
          userMap.set(id, [...userMap.get(id), socket.id]);
        }
        console.log(userMap);
      })) as UserDocument;
    } catch (error) {
      socket.disconnect();
    }

    // 收到客户端的消息(私聊)
    socket.on('message-private', async (data) => {
      message(socket, data, userInfo, userMap);
    });

    // 主动给客户端发送消息
    // socket.emit('message', '服务端给客户端发送的消息！');

    // socket 连接断开
    socket.on('disconnect', () => {
      if (!userInfo) return;
      const userConnect = disconnect(socket, userInfo.id, userMap);
      if (!userConnect) return;
      if (!userConnect.length) {
        console.log(`用户${userInfo.id}断开所有连接！`);
        userMap.delete(userInfo.id);
      } else {
        userMap.set(userInfo.id, userConnect);
      }
      console.log(userMap);
    });
  });
}
