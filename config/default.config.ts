const port = 3002;

const routerConfig = {
  prefix: '/api/v1',
};

const mongoose = {
  url: 'mongodb://127.0.0.1:27017/wechat',
  options: {},
};

export { port, routerConfig, mongoose };
