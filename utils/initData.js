const path = require('path');
const fs = require('fs');
const SingerModel = require('../model/singer');

class InitDataService {
  async index() {
    const singersResult = await SingerModel.find({}); // 查询 goods 集合所以文档
    if (!singersResult.length) {
      let singersFlag; // 用于导入 goods 数据成功 或 失败标识

      let singersCount = 0; // goods 数据计数
    
      let tasks_1 = ()=>new Promise((resolve, reject) => {
        // 导入商品数据 到 数据库
        fs.readFile(path.resolve(__dirname, '../jsondata/singer.json'), 'utf8', async (err, data) => {
          if (!err) {
            data = JSON.parse(data); // parse() 用于将一个字符串解析成一个 json 对象
            for (let item of data) {
              let singerEntity = new SingerModel(item);
              try {
                await singerEntity.save();
                singersCount++;
                singersFlag = true;
                console.log(`Goods 数据成功导入第: ${ singersCount } 条`);
              } catch (error) {
                singersFlag = false;
                reject(error);
                console.log('Goods 数据导入失败...');
              }
            }
            resolve();
          } else {
            reject(err);
          }
        });
      });

   

      try {
        await tasks_1();
        if (singersFlag ) {
          return {
              msg:'导入完成'
          };
        }
      } catch (error) {
        console.log("错误:\n", error);
        if (!singersFlag) {
            if (!singersFlag) return { msg: ' 数据导入失败...' };
        } 
      }
    } else {
      return {
        msg: `数据库中已存在 Goods 数据 ${ singersResult.length } 条, 无需再次导入`, 
    
      };
    }
  }
}

module.exports = new InitDataService();