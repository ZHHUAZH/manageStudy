// 引入MongoDB数据库
const mongoose = require("mongoose")
//引入MongoDB数据库config—>index配置文件
const config = require("../config")
mongoose.set('strictQuery', true)
//连接 mongodb,创建一个数据库叫：dwzhihu
mongoose.connect(config.db.URL)
const db = mongoose.connection
//数据库连接失败,打印“数据库连接失败”和 错误原因（err）
db.on("error", err => {
    console.log("数据库连接失败", err);
})
//数据库连接成功
db.on("open", () => {
    console.log("数据库连接成功");
})