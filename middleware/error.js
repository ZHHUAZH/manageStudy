module.exports = (err, req, res, next) => {  //err 只能加在最前面
    //防止敏感信息泄露
    res.status(500).json({
        code: 500,
        msg: "服务端错误"
    })
    //测试时就在服务端输出错误信息
    console.log(err);
}