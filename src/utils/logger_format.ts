import { createRequestLogger } from '../service/logger';

export default (logger: string) => {
  const reg =
    /^::ffff:(.+)? - - \[(.+)?\] "(.+)? (.+)? (.+)?" (\d+)? (.+)? "(.+)?"$/;
  const match = logger.trim().match(reg);
  const [prefix, ip, date, method, url, protocol, status, info, form] =
    match || [];
  // 保存请求日志
  if (process.env.NODE_ENV === 'production') {
    createRequestLogger({
      ip,
      date,
      method,
      url,
      protocol,
      status: Number(status || 0),
      form,
    });
  }

  // 打印日志
  console.log(logger.trim());
};
