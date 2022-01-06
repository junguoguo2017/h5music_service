
const mongoose = require('mongoose');
// 建立数据模型
const singerSchem = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  id: {
    type: String, 
    unique:true
  }
});
//最后导出模型
const SingerModel = mongoose.model('singers', singerSchem);
module.exports = SingerModel;