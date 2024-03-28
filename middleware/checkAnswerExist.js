//导入答案模块
const { Answer } = require("../model/answers")

// 检测答案是否存在 中间件
module.exports = async (req, res, next) => {
    const answers = await Answer.findById(req.params.id).select("+answerer");
    if (!answers) return res.status(404).json({
        code: 404,
        msg: "该答案不存在！"
    })
    //判断问题下有没有答案
    if (req.params.questionId && answers.questionId !== req.params.questionId) {
        return res.status(400).json({
            code: 400,
            msg: "该问题下没有答案！"
        })
    }
    next();
}