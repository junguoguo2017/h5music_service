
const mongoose = require('mongoose');
// 建立数据模型
const musicSchem = new mongoose.Schema({
  author: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  lrc: {
    type: String, //歌词
    default: ''
  },
  pic: {
    type: String,
    default: ''
  },
  songid: {
    type: String,
    default: '',
    unique:true
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  url:{
    type: String,
    default: ''
  },
  existUrl:{
    type:Boolean,
    default:true
  }
});
//最后导出模型
const MusicModel = mongoose.model('musics', musicSchem);
module.exports = MusicModel;