//导入评论模块
const { Comment } = require("../model/comments")

// 检测评论人 中间件
module.exports = async (req, res, next) => {
    const comment = await Comment.findById(req.params.id).select("+commentator");
    if (comment.commentator.toString() !== req.userData._id) {   //通过 Id 比较回答问题的人与登陆的人是否为同一个人
        return res.status(400).json({
            code: 400,
            msg: "没有权限！"
        })
    }
    next();
}