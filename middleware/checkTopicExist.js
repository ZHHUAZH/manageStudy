//导入话题模块
const { Topic } = require("../model/topics")

// 检测话题是否存在中间件
module.exports = async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({
        code: 404,
        msg: "该话题不存在！"
    })
    next();
}