//引入用户模块
const { User } = require("../model/user")
//引入加密包 bcrypy
const bcrypt = require("bcryptjs")

exports.login = async (req, res, next) => {
    try {
        //首先获取到校验过后的数据
        const validValue = req.validValue
        //校验逻辑
        //1.检测用户是否存在
        let user = await User.findOne({ email: validValue.email }).select("+password")
        
        //2.如果用户不存在，那就直接返回失败的响应
        if (!user) {
            return res.status(400).json({
                code: 400,
                msg: "用户名或者密码错误"
            })
        }
        //3.如果用户存在，我们再来检测密码是否正确
        //第一个思路：拿到数据库的密码是加密的，所以需要先解密，然后进行比较，看是否正确
        //第二个思路：我们将用户目前登陆的密码（未加密的）也进行加密，然后那着2个加密的密码进行比较
        //采用第二个思路，因为反复提取数据库信息会加重服务器负担，并且有的加密是不能被解密的
        //compare中需要传入两个或三个参数，若其中一个为null/undefind，就会报错：data and hsah arguments required.
        let compareResult = await bcrypt.compare(validValue.password, user.password)
        //4.如果密码不正确，返回失败的响应
        if (!compareResult) {
            return res.status(400).json({
                code: 400,
                msg: "用户名或者密码错误"
            })
        }
        //5.以上校验完成，登陆成功，响应成功的信息
        res.status(200).json({
            code: 200,
            msg: "登陆成功",
            authorization: {
                token: user.generateToken()
            }
        })
    } catch (err) {
        next(err)
    }
}