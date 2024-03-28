//问题的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 questions 结构
const questionSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //标题
    title: {
        type: String,
        required: true
    },
    //描述
    description: {
        type: String
    },
    //提出问题的人
    questioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },

    //话题
    topics: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"  //与话题模块进行关联
        }],
        select: false
    }
},
//增加时间显示
{timestamps: true}
)

//创建 Model
const Question = mongoose.model("Question", questionSchema)
//问题数据 校验规则
function questionValidator(data) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        questioner: Joi.objectId(),

        topics: Joi.array().items(Joi.objectId())
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Question,
    //导出用户校验规则
    questionValidator
}