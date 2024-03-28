const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")
//导入两个封装的校验中间件
const checkQuestionsExist = require("../middleware/checkQuestionsExist")
const checkQuestioner = require("../middleware/checkQuestioner")
//导入用户信息校验函数
const { questionValidator } = require("../model/questions")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const question = require("../controller/questions")

//获取问题列表 配置
router.get("/", question.getQuestionsList)

//获取指定问题 配置
router.get("/:id", checkQuestionsExist, question.getQuestion)

//创建/新增问题
router.post("/", [auth, validator(questionValidator)], question.createQuestion)

//更新/修改问题
router.patch("/:id", [auth, validator(questionValidator), checkQuestionsExist, checkQuestioner], question.updateQuestion)

//删除问题
router.delete("/:id", [auth, checkQuestionsExist, checkQuestioner], question.deleteQuestion)

//最后将其导出
module.exports = router