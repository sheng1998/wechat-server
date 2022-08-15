import { Response } from 'express';
import { Code, Message, Option } from '../../typings/response';

// 请求成功
const success = (response: Response, data: unknown, options?: Option) => {
  const { status, message } = options || {};
  return response.status(status || 200).send({
    code: Code.success,
    data,
    message: message || Message.success,
  });
};

// 校验失败（参数校验失败或者错误，请求数据不存在）
const failure = (response: Response, data: unknown, message?: string) => {
  return response.status(422).send({
    code: Code.failure,
    data,
    message: message || Message.failure,
  });
};

// 没有权限
const denied = (response: Response, data: unknown) => {
  return response.status(403).send({
    code: Code.denied,
    data,
    message: Message.denied,
  });
};

// 系统致命错误
const error = (
  response: Response,
  data: unknown,
  message?: unknown,
  status?: number
) => {
  return response.status(status || 500).send({
    code: Code.error,
    data,
    message: message || Message.error,
  });
};

const response = {
  success,
  failure,
  denied,
  error,
};

export default response;
