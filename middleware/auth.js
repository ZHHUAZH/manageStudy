// 鉴权处理

// 引入加密包jwt
const jwt = require("jsonwebtoken")
//引入配置文件
const config = require("../config")

module.exports = function (req, res, next) {
    //前端在请求接口的时候，需要在header（请求头）带上我们后端生成的token
    //1.保存数据（token）
    const token = req.header("Authorization")
    // return err
    // console.log(token);
    //2.检测是否存在token
    if (!token) {
        return res.status(400).json({
            code: 400,
            msg: "Unauthorization 无Token"
        })
    }
    try {
        //3.当token存在的时候，验证是否有效。（token可能过期也可能错误），用jwt模块进行检验
        const userData = jwt.verify(token, config.secret)
        req.userData = userData   //userData封装着校验后的用户信息
        next()
    } catch (err) {
        return res.status(401).json({
            code: 401,
            msg: "Unauthorization Token 无效"
        })
    }
}
