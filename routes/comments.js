const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")
//导入两个封装的校验中间件
const checkCommentExist = require("../middleware/checkCommentExist")
const checkCommentator = require("../middleware/checkCommentator")
//导入评论数据校验函数
const { commentValidator } = require("../model/comments")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const comment = require("../controller/comments")

//获取评论列表 配置
router.get("/", comment.getCommentsList)

//获取指定评论 配置
router.get("/:id", comment.getComment)

//创建/新增评论
router.post("/", [auth, validator(commentValidator)], comment.createComment)

//更新/修改评论
router.patch("/:id", [auth, validator(commentValidator), checkCommentExist, checkCommentator], comment.updateComment)

//删除评论
router.delete("/:id", [auth, checkCommentExist, checkCommentator], comment.deleteComment)

//最后将其导出
module.exports = router