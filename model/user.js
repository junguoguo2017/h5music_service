
const mongoose = require('mongoose');
// 建立数据模型
const userSchem = new mongoose.Schema({
  username: {
    type: String,
    default: ''
  },
  userage: {
    type: Number,
    default: 0
  },
  usersex: {
    type: Number, //1 男 2 女 3 未知
    default: 3
  },
  userphone: {
    type: String,
    default: ''
  },
  usernick: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: '123456'
  }
});
//最后导出模型
const UserModel = mongoose.model('users', userSchem);
module.exports = UserModel;