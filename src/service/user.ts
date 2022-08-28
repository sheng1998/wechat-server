import { NextFunction } from 'express';
import { User } from '../../typings/user';
import UserModel from '../model/user.model';
import saveErrorInfo from './error';

// 创建用户
const create = async (user: User, next?: NextFunction) => {
  try {
    const userModel = new UserModel(user);
    return await userModel.save();
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

// 根据ID查找用户
const findById = async (id: string, next?: NextFunction) => {
  try {
    return await UserModel.findById(id);
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

// 根据用户名查找用户
const findByUsername = async (username: string, next?: NextFunction) => {
  try {
    return await UserModel.findOne({ username });
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

// 获取用户列表
const getUserList = async (id?: string | undefined, next?: NextFunction) => {
  try {
    if (id) {
      return await UserModel.find({
        _id: { $ne: id },
      });
    }
    return await UserModel.find({});
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    }
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      saveErrorInfo(error as Error);
    } else {
      console.log(error);
    }
  }
};

export { create, findById, findByUsername, getUserList };
