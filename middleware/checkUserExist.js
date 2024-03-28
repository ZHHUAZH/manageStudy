//关注模块用到

//导入用户模块
const { User } = require("../model/user")

// 检测用户是否存在中间件
module.exports = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({
        code: 404,
        msg: "该用户不存在！"
    })
    next();
}