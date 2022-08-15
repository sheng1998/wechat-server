// socket 连接相关操作
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export default function (server: HttpServer) {
  // const io = new Server(server, { cors: { origin: '*' } });
  const io = new Server(server);

  io.on('connection', (socket) => {
    // 收到客户端的消息
    socket.on('message', (data) => {
      console.log('服务端收到客户端的消息: ', JSON.stringify(data));
      // 相当于socket.emit('message', '你好客户端, 我是服务端！');
      socket.send('你好客户端, 我是服务端！');
    });

    socket.on('error', (err) => {
      console.log(err);
    });

    // 主动给客户端发送消息
    socket.emit('message', '服务端给客户端发送的消息！');

    // socket 连接断开
    socket.on('disconnect', () => {
      console.log(`${socket.id}断开连接！`);
    });
  });
}
