//导入评论模块
const { Comment } = require("../model/comments")

// 检测评论是否存在 中间件
module.exports = async (req, res, next) => {
    const comments = await Comment.findById(req.params.id).select("+commentator");
    if (!comments) return res.status(404).json({
        code: 404,
        msg: "该评论不存在！"
    })
    //判断评论下有没有答案
    if (req.params.questionId && comments.questionId !== req.params.questionId) {
        return res.status(400).json({
            code: 404,
            msg: "该问题下没有评论！"
        })
    }
    //答案模块
    if (req.params.answerId && comments.answerId !== req.params.answerId) {
        return res.status(400).json({
            code: 404,
            msg: "该答案下没有评论！"
        })
    }
    next();
}