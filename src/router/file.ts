import { Router } from 'express';
import authority from '../middleware/authority';
import multer from '../middleware/multer';
import {
  deleteUploadChuncks,
  getUploadChuncks,
  uploadChunck,
} from '../controller/file';

const router = Router();

// 上传文件分片
router.post('/upload_chunck', authority, multer, uploadChunck);
// TODO 获取已上传的分片下标
router.get('/upload_chuncks', authority, getUploadChuncks);
// TODO 清空已上传分片
router.delete('/upload_chuncks', authority, deleteUploadChuncks);

export default router;
