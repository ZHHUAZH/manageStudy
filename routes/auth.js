//登陆路由
const router = require("express").Router()

const auth = require("../controller/auth")

//对登陆进行校验
const validator = require("../middleware/validate")
//对用户进行校验
const { userValidator } = require("../model/user")

router.post("/", validator(userValidator), auth.login)

module.exports = router