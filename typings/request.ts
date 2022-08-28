import { Request } from 'express';
import { UserDocument } from './user';

interface CustomRequest extends Request {
  user?: UserDocument | null;
}

export default CustomRequest;
