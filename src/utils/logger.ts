import pino from 'pino';
import dayjs from 'dayjs';

const log = pino({
  transport: {
    target: 'pino-pretty',
  },
  timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`,
});

export default log;
