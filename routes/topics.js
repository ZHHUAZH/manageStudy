// 导入路由
const router = require("express").Router()  //链式调用

//引入controller代码构造组件
const topic = require("../controller/topics")

//引入鉴权中间件
const auth = require("../middleware/auth")

//导入用户信息校验函数
const { topicValidator } = require("../model/topics")

//导入校验中间件
const validator = require("../middleware/validate")

//导入话题是否存在de 校验
const checkTopicExist = require("../middleware/checkTopicExist")

//获取话题列表 配置
router.get("/", topic.getTopicsList)

// 获取指定话题 配置
router.get("/:id", topic.getTopic)

//创建话题
router.post("/", [auth, validator(topicValidator)], topic.createTopic)

//更新/修改话题
router.patch("/:id", [auth, validator(topicValidator)], topic.updateTopic)

//获取话题粉丝
router.get("/:id/followers", checkTopicExist, topic.listTopicFollowers)

//话题的问题列表
router.get("/:id/questions",checkTopicExist,topic.listQuestions)

module.exports = router