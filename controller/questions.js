//问题的增删改查

//导入问题模型（数据结构）
const { Question } = require("../model/questions")

//导入用户模型
const { User } = require("../model/user")

//获取问题列表
exports.getQuestionsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const questionList = await Question.find({ $or: [{ title: keyword }, { description: keyword }] }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!questionList) return res.status(400).json({
            code: 400,
            msg: "获取问题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题列表成功！",
            data: questionList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定问题
exports.getQuestion = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        const question = await Question.findById(req.params.id).select(selectFields).populate("questioner topics")
        if (!question) return res.status(400).json({
            code: 400,
            msg: "获取问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题成功",
            data: question
        })
    } catch (err) {
        next(err)
    }
}

//新增问题
exports.createQuestion = async (req, res, next) => {
    try {
        //直接创建问题，因为多个人可以提出同一个问题
        const question = new Question({ ...req.body, questioner: req.userData._id })  //在里面传入参数：req.body(提出的问题)、questioner(提出问题人的ID)
        await question.save()
        res.status(200).json({
            code: 200,
            msg: "问题创建成功！",
            data: question
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改问题
exports.updateQuestion = async (req, res, next) => {
    try {
        let questionId = req.params.id
        const data = await Question.findByIdAndUpdate(questionId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新问题失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新问题成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除问题
exports.deleteQuestion = async (req, res, next) => {
    try {
        const data = await Question.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除问题成功！"
        })
    } catch (err) {
        next(err)
    }
}