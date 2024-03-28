// 封装校验中间件
module.exports = (validator) => {
    return (req, res, next) => {
        const { error, value } = validator(req.body)
        console.log(error);
        if (error) {
            //说明数据有错，不能继续向后执行
            return res.status(400).json({
                code: 400,
                value: error._original,
                msg: error.details[0].message
            })
        }
        //数据信息校验通过，响应成功的信息
        req.validValue = value  //定义了一个变量validValue，如果验证成功，把value赋值给validValue
        next()
    }
}