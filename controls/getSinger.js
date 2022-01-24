const SingerModel = require('../model/singer')

const getSinger =async ctx=>{
    try {
        const result =  await SingerModel.find()
        ctx.body = {
            code:0,
            data:result
        }
    } catch (error) {
        
    }
}
