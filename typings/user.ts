import Mongoose from 'mongoose'

interface User {
  // id?: string;
  avatar?: string;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  privileges: number;
  // privileges: 0 | 1 | 2 | 3;
}

interface UserDocument extends Mongoose.Document, User {
}

export { User, UserDocument };
