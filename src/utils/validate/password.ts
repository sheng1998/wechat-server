const validator = (password: unknown): string | undefined => {
  let message = '';
  if (!password) {
    message = '请输入密码！';
  } else if (typeof password !== 'string') {
    message = '密码必需为字符串！';
  } else if (/\s+/.test(password)) {
    message = '密码禁止携带空格！';
  } else if (/[‘’“”，。、；：？！【】《》（）\u4e00-\u9fa0]/.test(password)) {
    message = '密码禁止含有中文或中文字符！';
  } else if (password.length < 8 || password.length > 30) {
    message = '密码长度限制在8-30字符之间！';
  } else if (/[\\/]/.test(password)) {
    message = '密码禁止携带斜杠！';
  } else if (!/([a-z].?\d)|(\d.?[a-z])/i.test(password)) {
    message = '密码必需含有字母和数字！';
  }
  if (message) return message;
  return undefined;
};

export default validator;
