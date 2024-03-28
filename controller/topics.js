//导入话题模型（数据结构）
const { Topic } = require("../model/topics")

//导入用户模型
const { User } = require("../model/user")

//导入问题模型
const { Question } = require("../model/questions")

//获取话题列表
exports.getTopicsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const topicsList = await Topic.find({ name: new RegExp(req.query.keyword) }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据
        if (!topicsList) return res.status(400).json({
            code: 400,
            msg: "获取话题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题列表成功！",
            data: topicsList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定话题
exports.getTopic = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        const topic = await Topic.findById(req.params.id).select(selectFields)
        if (!topic) return res.status(400).json({
            code: 400,
            msg: "获取话题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题成功",
            data: topic
        })
    } catch (err) {
        next(err)
    }
}

//创建话题
exports.createTopic = async (req, res, next) => {
    try {
        //1.检测话题是否存在
        const data = req.body  //body 是用户输入的数据
        let topic = await Topic.findOne(data)
        //2.若已经存在，就不创建了
        if (topic) return res.status(400).json({
            code: 400,
            msg: "该话题已存在！",
            value: data
        })
        //3.创建我们的话题数据，并返回响应
        topic = new Topic(data)
        await topic.save()
        res.status(200).json({
            code: 200,
            msg: "话题创建成功！",
            data: data
        })
    } catch (err) {
        next(err)
    }
}

//更新话题
exports.updateTopic = async (req, res, next) => {
    try {
        let topicId = req.params.id
        const data = await Topic.findByIdAndUpdate(topicId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新话题失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新话题成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//话题的粉丝
exports.listTopicFollowers = async (req, res, next) => {
    try {
        const users = await User.find({ followingTopic: req.params.id })
        if (!users) return res.status(400).json({
            code: 400,
            msg: "查询话题粉丝失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询话题粉丝成功！",
            data: users
        })
    } catch (err) {
        next(err)
    }
}

//话题的问题列表
exports.listQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find({ topics: req.params.id })
        if (!questions) return res.status(400).json({
            code: 400,
            msg: "查找失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查找成功！",
            data: questions
        })
    } catch (err) {
        next(err)
    }
}