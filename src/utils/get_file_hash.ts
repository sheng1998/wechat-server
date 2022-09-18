/**
 * 获取文件的 hash 值
 * 目前支持获取文件的 md5、sha1、sha256 值
 */
import fs from 'fs';
import crypto from 'crypto';

type HashType = 'md5' | 'sha1' | 'sha256';

type Result = {
  [key in HashType]?: string;
};

// 获取文件Hash值(md5、sha1、sha256)
const getFileHash = <T extends HashType[]>(
  path: string,
  hashs: T
): Promise<{
  [P in T[number]]: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      reject('the file does not exist, make sure your file is correct!');
      return;
    }
    const stream = fs.createReadStream(path);
    // 需要获取的时候才初始化
    const md5 = hashs.includes('md5') ? crypto.createHash('MD5') : null;
    const sha1 = hashs.includes('sha1') ? crypto.createHash('SHA1') : null;
    const sha256 = hashs.includes('sha256')
      ? crypto.createHash('SHA256')
      : null;

    stream.on('data', (data) => {
      md5?.update(data);
      sha1?.update(data);
      sha256?.update(data);
    });

    stream.on('end', () => {
      const data: Result = {};
      if (md5) {
        data.md5 = md5.digest('hex');
      }
      if (sha1) {
        data.sha1 = sha1.digest('hex');
      }
      if (sha256) {
        data.sha256 = sha256.digest('hex');
      }
      resolve(
        data as {
          [P in T[number]]: string;
        }
      );
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};

export default getFileHash;
