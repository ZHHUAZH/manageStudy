//答案的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 answers 结构
const answerSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //内容
    content: {
        type: String,
        required: true
    },
    //回答的人
    answerer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    //问题的Id，每一个回答都需要对应一个问题
    questionId: {
        type: String
    },

    //赞的数量
    voteCount: {
        type: Number,
        default: 0,
        required: true
    },
    //踩的数量
    dislikeVoteCount: {
        type: Number,
        default: 0,
        required: true
    }
},
//增加时间显示
{timestamps: true}
)

//创建 Model
const Answer = mongoose.model("Answer", answerSchema)
//答案数据 校验规则
function answerValidator(data) {
    const schema = Joi.object({
        content: Joi.string().required(),
        answerer: Joi.objectId(),
        questionId: Joi.string(),
        voteCount: Joi.number(),
        dislikeVoteCount: Joi.number()
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Answer,
    //导出答案校验规则
    answerValidator
}