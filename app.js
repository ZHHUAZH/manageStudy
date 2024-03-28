//项目入口
// 导入config-index.js 里配置文件
const config = require("./config")
/*打印app: { port: 5000 },
db: { URL: 'mongodb://127.0.0.1:27017/dwzhihu' },
secret: '3850E31B-779F-A6D5-513A-894328050E5A'。*/
// console.log(config)

// 导入express
const express = require("express")

// 引入跨域 cors 配置
const cors = require("cors")

// 导入 日志配置 morgan
const morgan = require("morgan")

//创建一个express 的实例
const app = express()

//处理中间件
/* 1.处理json的中间件 */
app.use(express.json()) //解析JSON格式
// app.use(express.urlencoded())  //解析form表单格式

/* 2.处理跨域中间件 */
app.use(cors())



/* 处理日志 中间件,作用：限制端口后添加xxxx */
app.use(morgan("dev"))

//静态资源（图片等文件）托管
app.use(express.static("public"))

//引入数据库
require("./model")

//引入路由中间件模块
app.use("/api", require("./routes"))

//注意点：中间件必须放在路由后面，否则不能生效
//引入错误处理的中间件
app.use(require("./middleware/error"))


//监听 3000 端口
// app.listen(3000,() => {
//     console.log("项目启动成功");
// })

//自由端口
app.listen(config.app.port, () => {
    console.log(`Running at http://127.0.0.1:${config.app.port}`);
})