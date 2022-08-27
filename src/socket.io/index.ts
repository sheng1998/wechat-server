// socket 连接相关操作
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { checkLoginState } from '../controller/user/login';

export default function (server: HttpServer) {
  // const io = new Server(server, { cors: { origin: '*' } });
  const io = new Server(server);

  io.on('connection', async (socket) => {
    const { session } = socket.handshake.auth;
    console.log('socket连接成功, 正在校验身份!');

    socket.on('error', (err) => {
      console.log(err);
    });

    const user = await checkLoginState(session);
    if (user) {
      socket.emit('authority', { code: 0, message: '身份校验成功!' });
      console.log('身份校验成功!');
    } else {
      socket.emit('authority', { code: 1, message: '身份校验失败, 自动断开连接!' });
      console.log('身份校验失败, 自动断开连接!');
      socket.disconnect();
      return;
    }

    // 收到客户端的消息
    socket.on('message', (data) => {
      console.log('服务端收到客户端的消息: ', JSON.stringify(data));
      // 相当于socket.emit('message', '你好客户端, 我是服务端！');
      socket.send('你好客户端, 我是服务端！');
    });

    // 主动给客户端发送消息
    socket.emit('message', '服务端给客户端发送的消息！');

    // socket 连接断开
    socket.on('disconnect', () => {
      console.log(`${socket.id}断开连接！`);
    });
  });
}
