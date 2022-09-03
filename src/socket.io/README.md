# 发送接收消息说明

```javascript
// socket 连接成功
io.on('connection', callback(socket));

// socket 断开连接
socket.on('disconnect', callback());

// 收到客户端的消息(私聊)
socket.on('message-private', callback({receive_user_id, send_user_id, message, type}));

// 向客户端推送消息(私聊)
socket.emit('message-private', {receive_user_id, send_user_id, message, type});

// 收到客户端的消息(群聊)
socket.on('message-group', callback({receive_user_id, send_user_id, message, type}));

// 向客户端推送消息(群聊)
socket.emit('message-group', {receive_user_id, send_user_id, message, type});

// 收到客户端的消息(机器人)
socket.on('message-robot', callback({receive_user_id, send_user_id, message, type}));

// 向客户端推送消息(机器人)
socket.emit('message-robot', {receive_user_id, send_user_id, message, type});

// 同步消息到其他端(同一用户建立了多个连接)
socket.emit('message-private-sync', {receive_user_id, send_user_id, message, type});

// 向客户端推送公告
socket.broadcast('notice', {nid, message, type});
```
