//评论的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 comments 结构
const commentSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //评论内容
    content: {
        type: String,
        required: true
    },
    //评论人
    commentator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    //问题的ID
    questionId: {
        type: String
    },
    //回答的Id
    answerId: {
        type: String
    },


    //二级评论回复哪个评论，指向一级评论的ID
    rootCommentId: {
        type: String
    },
    //二级评论回复谁(指向一级评论人的ID)
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
//增加时间显示
{timestamps: true}
)

//创建 Model
const Comment = mongoose.model("Comment", commentSchema)
//评论数据 校验规则
function commentValidator(data) {
    const schema = Joi.object({
        content: Joi.string().required(),
        commentator: Joi.objectId,
        questionId: Joi.string(),
        answerId: Joi.string(),

        rootCommentId: Joi.string(),
        replyTo: Joi.objectId()
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Comment,
    //导出用户校验规则
    commentValidator
}