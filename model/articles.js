//文章数据结构

const mongoose = require("mongoose")

const Joi = require("joi")

//引入 Joi-objectid 并设置为 Joi 的属性
Joi.objectId = require("joi-objectid")(Joi)

//定义文章 article 的结构,结构表articleSchema
const articleSchema = new mongoose.Schema({
    _v: {
        type: Number,
        select: false
    },
    //文章标题
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    //文章内容
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200
    },
    //文章状态设置：发布/草稿
    status: {
        type: String
    },
    //创建时间
    createAt: {
        type: Date,
        default: Date.now
    },
    //更新时间
    updateAt: {
        type: Date,
        default: Date.now
    },
    //文章分类
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    //作者
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    //时间戳
    // { timestamps: true }
)

//创建模型model
const Article = mongoose.model("Article", articleSchema)

//定义文章 article 的校验规则
function articleValidator(data) {
    const schema = Joi.object({
        title: Joi.string().max(50).min(2).required().messages({
            "string.base": "title 必须为 string 类型",
            "string.min": "title 最少2个字符",
            "string.max": "title 最多50个字符",
            "any.required": "缺少必选参数 title"
        }),
        content: Joi.string().min(2).max(200).required().messages({
            "string.base": "content 必须为 string 类型",
            "string.min": "content 最少2个字符",
            "string.max": "content 最多200个字符",
            "any.required": "缺少必选参数 content"
        }),
        status: Joi.string().valid("published", "drafted", "trashed").required().messages({
            "string.base": "status 必须为 string 类型",
            "any.required": "缺少必选参数 content",
            "any.only": "valid 取值有误，可选值为 published|drafted|trashed"
        }),
        category: Joi.objectId().required().messages({
            "string.pattern.name": "category 格式有误，应为 ObjectId 格式",
            "any.required": "category 必须设置"
        })
    })
    return schema.validate(data)
}

//导出
module.exports = {
    Article,
    articleValidator
}