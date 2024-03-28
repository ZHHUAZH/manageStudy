// 用户数据模型
//引入配置文件
const config = require("../config")
//引入jwt，生成token的工具
const jwt = require("jsonwebtoken")

//引入MongoDB
const mongoose = require("mongoose")
//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//创建mongodb的Schema,Schema是mongodb数据库自带的用来定义结构的代码，非常强大
//定义user用户的数据库结构
const userSchema = new mongoose.Schema({
    //邮箱
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
        unique: true
    },
    //用户名
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    //密码
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1000,
        select: false
    },
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },

    //个人资料部分
    //头像/图像
    avatar_url: {
        type: String,
        select: false
    },
    //性别
    gender: {
        type: String,
        enmu: ["male", "female"],   //enmu：枚举
        default: "male",
        required: true
    },
    //一句话介绍
    headline: {
        type: String,
        maxlength: 100
    },
    //居住地
    locations: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
        select: false
    },
    //行业
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        select: false
    },
    //职业经历
    employments: {
        type: [{
            company: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            job: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }
        }],
        select: false
    },
    //教育经历
    educations: {
        type: [
            {
            school: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            major: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    },

    //关注与粉丝部分
    //关注的用户
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,  //查询时，通过ID关联到用户
            ref: "User"
        }],
        select: false
    },

    //话题部分
    followingTopic: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,  //查询时，通过ID关联到用户
            ref: "Topic"
        }],
        select: false
    },

    //用户的赞
    likingAnswers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }],
        select: false
    },
    //用户的踩
    dislikingAnswers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }],
        select: false
    },

    //收藏答案
    collectingAnswers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }],
        select: false
    },
})

//封装生成token的功能
userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id
    },
        config.secret,
        { expiresIn: "10d" }  //token过期时间 10天
    )
}

//创建 Model
const User = mongoose.model("User", userSchema)
//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        email: Joi.string().email().trim().lowercase().min(6).max(30).required().messages({
            "any.required": "缺少必要参数 email",
            "string.email": "email 格式错误",
            "string.min": "email 最少为6个字符",
            "string.max": "email 最多为30个字符",
        }),
        name: Joi.string().min(2).max(20).required().messages({
            "any.required": "缺少必要参数 name",
            "string.base": "name 必须为String类型",
            "string.min": "name 最少为2个字符",
            "string.max": "name 最多为20个字符",
        }),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{6,16}$/).required().messages({
            "any.required": "缺少必要参数 password",
            "string.min": "password 最少为6个字符",
            "string.max": "password 最多为16个字符",
        }),
        _id: Joi.objectId(),

        // 头像字段校验
        avatar_url: Joi.string().messages({
            "string.base": "图像地址必须为string类型"
        }),
        //性别校验
        gender: Joi.any().valid("male", "female").default("male").messages({
            "any.only": "只能传入male或者fanale"
        }),
        //一句话介绍校验
        headline: Joi.string().max(100).messages({
            "string.base": "headline 必须为 string 类型",
            "string.max": "headline 最多100个字符"
        }),
        //居住地校验
        locations: Joi.array().items(Joi.objectId()).messages({
            "array.base": "locations 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
        //行业校验
        business: Joi.objectId().messages({
            "string.base": "business 必须为 objectId 类型"
        }),
        //职业校验
        employments: Joi.array().items(
            Joi.object().keys({
                company: Joi.objectId(),
                job: Joi.objectId()
            })
        ).messages({
            "array.base": "employments 必须为数组",
            "object.unknown": "传入的数据有误"
        }),
        //教育经历校验
        educations: Joi.array().items(
            Joi.object().keys({
                school: Joi.objectId(),
                major: Joi.objectId(),
                diploma: Joi.number().valid(1, 2, 3, 4, 5),
                entrance_year: Joi.number(),
                graduation_year: Joi.number()
            })
        ).messages({
            "array.base": "educations 必须为数组",
            "object.unknown": "传入的数据有误",
            "any.only": "diploma 只能从1,2,3,4,5 中进行选取",
            "string.base": "school 与 major 只能是 objectId 类型",
            "number.base": "entrance_year 与 grations_year 只能是 Number 类型",
            "object.unknown": "传入的数据有误"
        }),

        //关注校验
        following: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            })
        ).messages({
            "array.base": "following 必须为数组类型"
        }),

        //话题校验
        followingTopic: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            })
        ).messages({
            "array.base": "followingTopic 必须为数组类型"
        }),

        //赞校验
        likingAnswers: Joi.array().items(Joi.objectId()).messages({
            "array.base": "likingAnswers 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
        //踩校验
        dislikingAnswers: Joi.array().items(Joi.objectId()).messages({
            "array.base": "likingAnswers 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
        //收藏校验
        collectingAnswers: Joi.array().items(Joi.objectId()).messages({
            "array.base": "likingAnswers 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
    })
    return schema.validate(data)
}
//导出
module.exports = {
    //导出model
    User,
    //导出用户校验规则
    userValidator
}