//有很多路由，在此文件进行管理
const router = require("express").Router()

//进行管理
//用户接口
router.use("/user", require("./user"))

//登陆接口
router.use("/auth", require("./auth"))

//上传文件接口
router.use("/upload", require("./upload"))

//话题模块接口
router.use("/topics", require("./topics"))

//问题模块接口
router.use("/questions", require("./questions"))

//答案模块接口   (二级嵌套路由：问题--->答案；     一对多的关系)
router.use("/questions/:questionId/answers", require("./answers"))

//评论模块接口   (三级嵌套路由： 问题--->答案--->评论)
router.use("/questions/:questionId/answers/:answerId/comments", require("./comments"))

//分类模块接口
router.use("/categories", require("./categories"))

//文章模块接口
router.use("/articles", require("./articles"))

module.exports = router