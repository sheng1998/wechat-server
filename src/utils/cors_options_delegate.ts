import { Request } from 'express';

const corsOrigins = ['119.91.74.150', 'sheng1998.github.io/'];

export default (request: Request, callback: (...arg: any) => void) => {
  const { origin } = request.headers;
  if (!origin) {
    callback(null, { origin: false });
    return;
  }
  for (let i = 0; i < corsOrigins.length; i += 1) {
    const item = corsOrigins[i];
    if (
      origin?.startsWith(`http://${item}`) ||
      origin?.startsWith(`https://${item}`)
    ) {
      callback(null, { origin: true });
      return;
    }
  }
  callback(null, { origin: false });
};
