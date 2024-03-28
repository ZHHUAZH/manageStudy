const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")
//导入两个封装的校验中间件
const checkAnswerExist = require("../middleware/checkAnswerExist")
const checkAnswerer = require("../middleware/checkAnswerer")
//导入用户信息校验函数
const { answerValidator } = require("../model/answers")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const answer = require("../controller/answers")

//获取答案列表 配置
router.get("/", answer.getAnswersList)

//获取指定答案 配置
// router.get("/:id", checkAnswerExist, answer.getAnswer)
router.get("/:id", answer.getAnswer)

//创建/新增答案
router.post("/", [auth, validator(answerValidator)], answer.createAnswer)

//更新/修改答案
router.patch("/:id", [auth, validator(answerValidator), checkAnswerExist, checkAnswerer], answer.updateAnswer)

//删除答案
router.delete("/:id", [auth, checkAnswerExist, checkAnswerer], answer.deleteAnswer)

//最后将其导出
module.exports = router