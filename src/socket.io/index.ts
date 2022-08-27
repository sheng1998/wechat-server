// socket 连接相关操作
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { checkLoginState } from '../controller/user/login';
import { UserDocument } from '../../typings/user';

export default function (server: HttpServer) {
  // const io = new Server(server, { cors: { origin: '*' } });
  const io = new Server(server);
  // 记录已经连接的用户ID
  const userMap = new Map();

  io.on('connection', async (socket) => {
    const { session } = socket.handshake.auth;
    let userInfo: UserDocument | null = null;
    console.log('socket连接成功, 正在校验身份!');

    socket.on('error', (err) => {
      console.log(err);
    });

    if (!session) {
      socket.emit('authority', {
        code: 1,
        message: '身份校验失败, 自动断开连接!',
      });
      console.log('身份校验失败, 自动断开连接!');
      socket.disconnect();
      return;
    }

    const user = await checkLoginState(session);
    if (user) {
      // TODO 保存数据库
      userInfo = user;
      const { id } = userInfo;
      if (!userMap.has(id)) {
        userMap.set(id, [socket.id]);
      } else {
        userMap.set(id, [...userMap.get(id), socket.id]);
      }
      socket.emit('authority', { code: 0, message: '身份校验成功!' });
      console.log('身份校验成功!', userMap);
    } else {
      socket.emit('authority', {
        code: 1,
        message: '身份校验失败, 自动断开连接!',
      });
      console.log('身份校验失败, 自动断开连接!');
      socket.disconnect();
      return;
    }

    // 收到客户端的消息
    socket.on('message', (data) => {
      console.log('服务端收到客户端的消息: ', data);
      const { uid, message, type } = data;
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
      // TODO 将信息保存到数据库
      // 相当于socket.emit('message', '你好客户端, 我是服务端！');
      // socket.send('你好客户端, 我是服务端！');
    });

    // 主动给客户端发送消息
    // socket.emit('message', '服务端给客户端发送的消息！');

    // socket 连接断开
    socket.on('disconnect', () => {
      if (!userInfo) return;
      const { id } = userInfo;
      if (id && userMap.has(id)) {
        console.log(socket.id);
        const userConnect = userMap.get(id) as string[];
        userConnect.splice(
          userConnect.findIndex((item) => item === socket.id),
          1
        );
        if (!userConnect.length) {
          console.log(`用户${userInfo.id}断开所有连接！`);
          // TODO 保存数据库
          userMap.delete(id);
        } else {
          userMap.set(id, userConnect);
        }
        console.log(userMap);
      }
    });
  });
}
