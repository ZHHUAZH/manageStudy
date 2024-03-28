//灵活配置信息
// 导出配置信息
module.exports = {
    app: {
        port: process.env.port || 5000   //配置了环境变量，就会使用环境变量，如果没有配置环境变量，就默认使用 3000 端口
    },
    // 数据库配置
    db: {
        URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/dwzhihu2"
        // URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/kssj"
    },
    //jwt密钥
    secret: "3850E31B-779F-A6D5-513A-894328050E5A"
}
