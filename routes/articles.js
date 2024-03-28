const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")

//导入评论数据校验函数
const { articleValidator } = require("../model/articles")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const articles = require("../controller/articles")

//获取文章列表 配置
router.get("/", articles.getArticlesList)

//获取指定文章 配置
router.get("/:id", articles.getArticle)

//创建/新增文章
router.post("/", [auth, validator(articleValidator)], articles.createtArticle)

//更新/修改文章
router.patch("/:id", [auth, validator(articleValidator)], articles.updateArticle)

//删除文章
router.delete("/:id", auth, articles.deleteArticle)

//最后将其导出
module.exports = router