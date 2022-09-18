import fs from 'fs';
import { resolve } from 'path';
import { Response } from 'express';
import CustomRequest from '../../../typings/request';
import response from '../../utils/response';
import { checkInfo, mergeChunk } from '../../service/file';
import { uploadBaseDir } from '../../config/default.config';

// 上传文件分片
const uploadChunck = async (req: CustomRequest, res: Response) => {
  const { index, total_chunk, file_md5 } = req.body;
  try {
    await checkInfo(req);
  } catch (error) {
    response.failure(res, {}, error as string);
    return;
  }

  // 判断目录是否存在, 不存在就创建
  const temDir = resolve(uploadBaseDir, req.user?.id, file_md5);
  const existDir = fs.existsSync(temDir);
  if (!existDir) {
    fs.mkdirSync(temDir, { recursive: true });
  }

  // 移动分片到指定目录
  fs.renameSync(req.file?.path || '', resolve(temDir, index || ''));

  // 判断分片数量和目录中文件总数一致(必须等于)
  const totalChunk = fs.readdirSync(temDir).length;
  if (totalChunk === Number(total_chunk)) {
    // 合并文件
    const result = await mergeChunk(req, temDir);
    // 判断源目录是否为空目录, 是就删除
    try {
      // 临时 chunk 文件所在目录
      fs.rmdirSync(resolve(uploadBaseDir, req.user?.id));
      // chunk 文件缓存目录
      fs.rmdirSync((req.file?.path || '').split('\\').slice(0, -1).join('\\'));
    } catch (error) {}

    // 响应请求
    response.success(res, result);
    return;
  }

  // 响应请求
  response.success(res, 'user', {
    pick: ['username', 'avatar', 'id', 'privileges'],
  });
};

// 获取已上传的分片下标
const getUploadChuncks = async (req: CustomRequest, res: Response) => {};

// 清空已上传分片
const deleteUploadChuncks = async (req: CustomRequest, res: Response) => {
  console.log(1);
};

export { uploadChunck, getUploadChuncks, deleteUploadChuncks };
