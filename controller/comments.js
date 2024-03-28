//评论的增删改查

//导入评论模型（数据结构）
const { Comment } = require("../model/comments")

//获取评论列表
exports.getCommentsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const { questionId, answerId } = req.params  // = req.params.questionId,req.params.answerId
        const { rootCommentId } = req.query
        const commentsList = await Comment.find({ content: keyword, questionId, answerId, rootCommentId }).limit(perPage).skip(page * perPage).populate("commentator replyTo")   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!commentsList) return res.status(400).json({
            code: 400,
            msg: "获取评论列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论列表成功！",
            data: commentsList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定评论
exports.getComment = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join(" ")
        const comment = await Comment.findById(req.params.id).select(selectFields).populate("commentator")
        if (!comment) return res.status(400).json({
            code: 400,
            msg: "获取评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论成功",
            data: comment
        })
    } catch (err) {
        next(err)
    }
}

//新增评论
exports.createComment = async (req, res, next) => {
    try {
        const { questionId, answerId } = req.params
        const commentator = req.userData._id
        //直接创建评论，因为多个人可以作出同一个评论
        const comment = new Comment({ ...req.body, answerer: req.userData._id, questionId, answerId, commentator })  //在里面传入参数：req.body(作出的评论)、questionId(提出问题人的ID)、answerer：回答问题的人
        await comment.save()
        res.status(200).json({
            code: 200,
            msg: "评论创建成功！",
            data: comment
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改评论
exports.updateComment = async (req, res, next) => {
    try {
        let commentId = req.params.id
        const { content } = req.body
        const data = await Comment.findByIdAndUpdate(commentId, content)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新评论失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新评论成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除评论
exports.deleteComment = async (req, res, next) => {
    try {
        const data = await Comment.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除评论成功！",
            data: data
        })
    } catch (err) {
        next(err)
    }
}