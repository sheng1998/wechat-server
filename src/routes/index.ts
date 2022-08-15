import { Express, Request, Response } from 'express';

function routes(app: Express) {
  app.get('/', (req: Request, res: Response) =>
    res.status(200).send('欢迎访问仿微信聊天室后台！')
  );
}

export default routes;
