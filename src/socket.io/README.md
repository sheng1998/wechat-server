# 发送接收消息说明

```javascript
// socket 连接成功
io.on('connection', callback(socket));

// socket 断开连接
socket.on('disconnect', callback());

// 收到客户端的消息(私聊)
socket.on('message', callback({receive_user_id, send_user_id, message, type}));

// 向客户端推送消息(私聊)
socket.emit('message', {receive_user_id, send_user_id, message, type});

// 收到客户端的消息(群聊)
socket.on('message-group', callback({receive_user_id, send_user_id, message, type}));

// 向客户端推送消息(群聊)
socket.emit('message-group', {receive_user_id, send_user_id, message, type});

// 向客户端推送公告
socket.broadcast('notice', {nid, message, type});
```
