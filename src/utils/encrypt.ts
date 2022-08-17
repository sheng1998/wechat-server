import crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { JSEncrypt } from 'nodejs-jsencrypt';
import { encryption } from '../config/default.config';

// 使用公钥加密字符串
const publicEncrypt = (data: string) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(encryption.publicKey);
  return encrypt.encrypt(data);
};

// 使用私钥解密
const privDecrypt = (data: string) => {
  const encrypt = new JSEncrypt();
  encrypt.setPrivateKey(encryption.privateKey);
  return encrypt.decrypt(data);
};

// 普通的md5加密
const md5 = (data: string) => {
  return crypto
    .createHash('md5')
    .update(`${data}X5MvjI1jiSUIH1s46s-FkrHgvlj_uGWs1waomf9I`)
    .digest('hex');
};

export { publicEncrypt, privDecrypt, md5 };
