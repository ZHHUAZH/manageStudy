const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")

//导入评论数据校验函数
const { categoryValidator } = require("../model/categories")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const category = require("../controller/categories")

//获取分类列表 配置
router.get("/", category.getCategoryList)

//获取指定分类 配置
router.get("/:id", category.getCategory)

//创建/新增分类
router.post("/", [auth, validator(categoryValidator)], category.createtCategory)

//更新/修改分类
router.patch("/:id", [auth, validator(categoryValidator)], category.updateCategory)

//删除分类
router.delete("/:id", auth, category.deleteCategory)

//最后将其导出
module.exports = router