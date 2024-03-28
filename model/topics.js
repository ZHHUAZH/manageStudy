//引入MongoDB
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//创建mongodb的Schema,Schema是mongodb数据库自带的用来定义结构的代码，非常强大
//定义 topic 的数据库结构
const topicSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //话题的名称
    name: {
        type: String,
        required: true
    },
    //图像
    avatar_url: {
        type: String,
    },
    //简介
    introduction: {
        type: String,
        maxlength: 500,
        select: false
    }
})

//创建 Model
const Topic = mongoose.model("Topic", topicSchema)

//创建信息内容校验规则对象,将其封装为一个函数。  
function topicValidator(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
        avatar_url: Joi.string(),
        introduction: Joi.string().max(500)
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Topic,
    //导出话题校验规则
    topicValidator
}