// 枚举状态码 根据自己需要定义
enum Code {
  success,
  failure,
  denied,
  error,
}

enum Message {
  success = '请求成功!',
  failure = '校验失败!',
  denied = '无权限!',
  error = '系统异常!',
}

// 状态类型 只能是Code中所枚举的状态
type Type = keyof typeof Code;

interface Option {
  type?: Type;
  status?: number;
  message?: unknown;
  pick?: string[];
}

export { Code, Type, Message, Option };
