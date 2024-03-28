//导入问题模块
const { Question } = require("../model/questions")

// 检测问题是否存在中间件
module.exports = async (req, res, next) => {
    const questions = await Question.findById(req.params.id).select("+questioner");
    if (!questions) return res.status(404).json({
        code: 404,
        msg: "该问题不存在！"
    })
    next();
}