//导入答案模块
const { Answer } = require("../model/answers")

// 检测回答人 中间件
module.exports = async (req, res, next) => {
    const answer = await Answer.findById(req.params.id).select("+answerer");
    if (answer.answerer.toString() !== req.userData._id) {   //通过 Id 比较回答问题的人与登陆的人是否为同一个人
        return res.status(400).json({
            code: 400,
            msg: "没有权限！"
        })
    }
    next();
}