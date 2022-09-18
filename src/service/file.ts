import path from 'path';
import fs from 'fs';
import CustomRequest from '../../typings/request';
import getFileHash from '../utils/get_file_hash';
import { formatTime } from '../utils/time';
import { uploadBaseDir } from '../config/default.config';

// 校验信息完整性
const checkInfo = async (req: CustomRequest) => {
  return new Promise((resolve, reject) => {
    const { chunk_hash, total_chunk, file_md5 } = req.body;
    if (!chunk_hash) {
      reject('必需携带 chunk_hash 字段!');
    } else if (!total_chunk) {
      reject('必需携带 total_chunk 字段!');
    } else if (!file_md5) {
      reject('必需携带 file_md5 字段!');
    } else {
      getFileHash(req.file?.path || '', ['md5'])
        .then((hash) => {
          if (hash.md5 !== chunk_hash) {
            reject('分片传输异常, 请尝试重传或者检查分片是否完整!');
          } else {
            resolve(null);
          }
        })
        .catch(() => {
          reject('获取文件 hash 异常!');
        });
    }
  });
};

// 合并分片
const mergeChunk = (req: CustomRequest, dir: string) => {
  return new Promise((resolve, reject) => {
    const { file_md5, file_name, total_chunk, file_sha1 } = req.body;
    const month = formatTime(Date.now(), 'YYMM');

    // 判断目录是否存在, 不存在就创建
    const temDir = path.resolve(uploadBaseDir, 'file', month);
    const existDir = fs.existsSync(temDir);
    if (!existDir) {
      fs.mkdirSync(temDir, { recursive: true });
    }

    // 文件所在路径
    const filePath = path.resolve(
      temDir,
      `${file_md5}${path.extname(file_name)}`
    );
    // 创建一个空文件
    fs.writeFileSync(filePath, '');

    for (let i = 0; i < total_chunk; i += 1) {
      // 读取源文件
      const chunk = fs.readFileSync(path.resolve(dir, i.toString()));
      fs.appendFileSync(filePath, chunk);
      // 删除源文件
      fs.rmSync(path.resolve(dir, i.toString()));
    }

    // 清空源目录
    fs.rmdirSync(dir);

    // 校验合并后文件的hash值是否一致
    getFileHash(filePath, ['md5', 'sha1']).then((hash) => {
      if (hash.md5 !== file_md5 || hash.sha1 !== file_sha1) {
        reject('文件 hash 校验失败!');
      } else {
        // TODO 文件可访问路径
        const url = `public/file/${month}/${file_md5}${path.extname(
          file_name
        )}`;
        // TODO 将文件信息保存到数据库

        resolve({
          ...hash,
          name: file_name,
          url,
        });
      }
    });
  });
};

export { checkInfo, mergeChunk };
