import mongoose from 'mongoose';

// 模板校验规则
const userSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    username: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    privileges: {
      type: Number,
      /**
       * 0 超级管理员(可以访问后台)
       * 1 普通用户(可以使用机器人聊天)
       * 2 普通用户(禁止使用机器人聊天)
       * 3 禁止登陆用户
       */
      enum: [0, 1, 2, 3],
      default: 1,
    },
  },
  {
    // Mongoose 在创建时 Schema 提供了 timestamps 参数，该参数会让 Mongoose 自动开启创建时间和更新时间。
    timestamps: true,
  }
);

// 创建模板 执行之后会自动在mongodb中创建相应的模板
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
