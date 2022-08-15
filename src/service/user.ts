import { User } from '../../typings/user';
import UserModel from '../model/user.model';

// 创建用户
const create = async (user: User) => {
  try {
    const userModel = new UserModel({ ...user, privileges: 1 });
    return await userModel.save();
  } catch (error) {
    return null;
  }
};

// 根据ID查找用户
const findById = async (id: string) => {
  try {
    return await UserModel.findById(id);
  } catch (error) {
    return null;
  }
};

// 根据用户名查找用户
const findByUsername = async (username: string) => {
  try {
    return await UserModel.findOne({ username });
  } catch (error) {
    return null;
  }
};

export { create, findById, findByUsername };
