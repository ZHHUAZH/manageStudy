const mongoose = require("mongoose")

const Joi = require("joi")

//定义分类category的结构,结构表categorySchema
const categorySchema = new mongoose.Schema({
    _v: {
        type: Number,
        select: false
    },
    //分类名称
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
})

//定义分类category的校验规则
function categoryValidator(data) {
    const schema = Joi.object({
        name: Joi.string().max(20).min(2).required().messages({
            "string.base": "name 必须为 string 类型",
            "string.min": "name 最少2个字符",
            "string.max": "name 最多20个字符",
            "any.required": "缺少必选参数 name"
        })
    })
    return schema.validate(data)
}

//创建模型model
const Category = mongoose.model("Category", categorySchema)

//导出
module.exports = {
    Category,
    categoryValidator
}