//答案的增删改查

//导入答案模型（数据结构）
const { Answer } = require("../model/answers")

//获取答案列表
exports.getAnswersList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const answersList = await Answer.find({ content: keyword, questionId: req.params.questionId }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!answersList) return res.status(400).json({
            code: 400,
            msg: "获取答案列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取答案列表成功！",
            data: answersList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定答案
exports.getAnswer = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join(" ")
        const answer = await Answer.findById(req.params.id).select(selectFields).populate("answerer")
        if (!answer) return res.status(400).json({
            code: 400,
            msg: "获取答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取答案成功",
            data: answer
        })
    } catch (err) {
        next(err)
    }
}

//新增答案
exports.createAnswer = async (req, res, next) => {
    try {
        //直接创建问题，因为多个人可以提出同一个问题
        const answer = new Answer({ ...req.body, answerer: req.userData._id, questionId: req.params.questionId })  //在里面传入参数：req.body(回答的答案)、questionId(提出问题人的ID)、answerer：回答问题的人
        await answer.save()
        res.status(200).json({
            code: 200,
            msg: "答案创建成功！",
            data: answer
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改答案
exports.updateAnswer = async (req, res, next) => {
    try {
        let answerId = req.params.id
        const data = await Answer.findByIdAndUpdate(answerId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新答案失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新答案成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除答案
exports.deleteAnswer = async (req, res, next) => {
    try {
        const data = await Answer.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除答案成功！"
        })
    } catch (err) {
        next(err)
    }
}