import { createRequestLogger } from '../service/logger';

export default (logger: string) => {
  const reg =
    /^::ffff:(.+)? - - \[(.+)?\] "(.+)? (.+)? (.+)?" (\d+)? (.+)? "(.+)?"$/;
  const match = logger.trim().match(reg);
  const [prefix, ip, date, method, url, protocol, status, info1, form] =
    match || [];
  // 保存请求日志
  createRequestLogger({ ip, date, method, url, protocol, status, form });

  // 打印日志
  console.log(logger.trim());
};
