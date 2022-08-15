const validator = (username: unknown): string | undefined => {
  let message = '';
  if (!username) {
    message = '请输入用户名!';
  } else if (typeof username !== 'string') {
    message = '用户名必需为字符串!';
  } else if (/\s+/.test(username)) {
    message = '用户名禁止携带空格!';
  } else if (username.length < 2 || username.length > 15) {
    message = '用户名长度限制在2-15字符之间!';
  } else if (/[\\/]+/.test(username)) {
    message = '用户名禁止携带斜杠!';
  }
  if (message) return message;
  return undefined;
};

export default validator;
