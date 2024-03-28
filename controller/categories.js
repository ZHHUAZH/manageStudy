//引入model
const { Category } = require("../model/categories")

//获取分类列表
exports.getCategoryList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        //1.查询所有分类
        const data = await Category.find({ name: keyword }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        //2.失败响应
        if (!data) return res.status(400).json({
            code: 400,
            msg: "查找分类列表失败！"
        })
        //3.成功响应
        res.status(200).json({
            code: 200,
            msg: "查找分类列表成功！",
            data  //data:data  ES6简写
        })
    } catch (err) {
        next(err)
    }
}

//获取指定分类
exports.getCategory = async (req, res, next) => {
    try {
        //1.检测分类是否存在
        //1.1校验id是否存在
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                code: 400,
                msg: "请传入分类 id"
            })
        }
        //2.获取分类
        const data = await Category.findById(id)
        //3.检测
        if (!data) {
            return res.status(400).json({
                code: 400,
                msg: "获取信息失败，请稍后再试！",
                value: { id }
            })
        }
        res.status(200).json({
            code: 200,
            msg: "获取指定分类成功！",
            data
        })
    } catch (err) {
        next(err)
    }
}

//新增分类
exports.createtCategory = async (req, res, next) => {
    try {
        // 1.检测分类是否存在
        const data = req.body
        let cate = await Category.findOne(data)
        //2.若分类信息存在，就不能新增了
        if (cate) {
            return res.status(400).json({
                code: 400,
                msg: "该分类已存在！",
                value: data
            })
        }
        //3.创建分类
        cate = new Category(data)
        await cate.save()
        res.status(200).json({
            code: 200,
            msg: "分类添加成功！",
            data
        })
    } catch (err) {
        next(err)
    }
}

//更新分类
exports.updateCategory = async (req, res, next) => {
    try {
        //1.检测id信息是否存在
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                code: 400,
                msg: "请传入id"
            })
        }
        //2.更新
        const data = await Category.findByIdAndUpdate(id, req.body, { new: true })
        //3.检测是否成功
        if (!data) return res.status(400).json({
            code: 400,
            msg: "编辑分类失败！",
            value: req.body
        })
        res.status(200).json({
            code: 200,
            msg: "更新编辑分类成功！",
            data    //在返回数据时，有时会返回更新前的，有时会返回更新后的，所以需要在 data 里添加 { new:true }，这样返回的数据就是更新后的了
        })
    } catch (err) {
        next(err)
    }
}

//删除分类
exports.deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await Category.findByIdAndDelete(id)
        //没找到id，失败
        if (!data) return res.status(400).json({
            code: 200,
            msg: "分类删除失败！",
            value: { id }
        })
        //找到id，删除成功
        res.status(200).json({
            code: 200,
            msg: "分类删除成功！"
        })
    } catch (err) {
        next(err)
    }
}