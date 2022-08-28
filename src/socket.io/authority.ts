// 权限校验相关逻辑
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { UserDocument } from '../../typings/user';
import { checkLoginState } from '../controller/user/login';
import { connection } from '../service/socket';

// 校验失败
function checkFailure(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.emit('authority', {
    code: 1,
    message: '身份校验失败, 自动断开连接!',
  });
  console.log('身份校验失败, 自动断开连接!');
}

export default (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  callback: (user: UserDocument) => void
) => {
  return new Promise((resolve, reject) => {
    const { session } = socket.handshake.auth;

    if (!session) {
      checkFailure(socket);
      reject();
      return;
    }

    checkLoginState(session).then(async (user) => {
      if (!user) {
        checkFailure(socket);
        reject();
        return;
      }
      // 保存数据到数据库（连接记录）
      if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
        await connection(user.id, socket.id);
      }
      callback(user);
      socket.emit('authority', { code: 0, message: '身份校验成功!' });
      resolve(user);
    });
  });
};
