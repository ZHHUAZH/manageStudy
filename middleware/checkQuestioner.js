//导入问题模块
const { Question } = require("../model/questions")

// 检测提问人 中间件
module.exports = async (req, res, next) => {
    const question = await Question.findById(req.params.id).select("+questioner");
    if (question.questioner.toString() !== req.userData._id) {   //通过 Id 比较提出问题的人与登陆的人是否为同一个人
        return res.status(400).json({
            code: 400,
            msg: "没有权限！"
        })
    }
    next();
}