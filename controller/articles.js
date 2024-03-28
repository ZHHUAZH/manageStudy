//引入文章model
const { Article } = require("../model/articles")

//获取文章列表
exports.getArticlesList = async (req, res, next) => {
    //不加分页功能,通过类型状态筛选
    // try {
    //     //检测是否存在 分类|状态  筛选条件
    //     const { status, category } = req.query
    //     let data
    //     //如果有文章状态，就通过文章状态查询
    //     if (status || category) {
    //         data = await Article.find(req.query)
    //     } else {   // 如果没有文章状态，就整体查询
    //         data = await Article.find()
    //     }
    //     //3.成功响应
    //     res.status(200).json({
    //         code: 200,
    //         msg: "获取所有文章成功！",
    //         data  //data:data  ES6简写
    //     })
    // } catch (err) {
    //     next(err)
    // }

    //加分页功能；  *分页功能与筛选条件不能同时工作*
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);  //per_page：是用户输入的
        //文章获取
        //检测是否存在 分类|状态  筛选条件
        const { status, category } = req.query
        let data
        //如果有文章状态，就通过文章状态查询
        if( status || category ) {
            data = await Article.find(req.query).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。
        }else {   // 如果没有文章状态，就整体查询
            data = await Article.find().limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。
        }
        //3.成功响应
        res.status(200).json({
            code: 200,
            msg: "获取所有文章成功！",
            data  //data:data  ES6简写
        })
    } catch (err) {
        next(err)
    }
}

//获取指定文章
exports.getArticle = async (req, res, next) => {
    try {
        //1.根据id获取数据
        const id = req.params.id;
        const data = await Article.findById(id).populate("category author")
        //检测是否存在数据
        if (!data) {
            return res.status(400).json({
                code: 400,
                msg: "获取文章失败！",
                value: { id }
            })
        }
        res.status(200).json({
            code: 200,
            msg: "获取指定文章成功！",
            data
        })
    } catch (err) {
        next(err)
    }
}

//新增文章
exports.createtArticle = async (req, res, next) => {
    try {
        //1.创建并储存数据，  在创建数据的时候，req.body 是要创建的数据，{author:req.userData._id} 是同时传入作者的Id；使用Object.assign(req.body,{author:req.userData._id})进行组合传送。  之前的代码也可以这样进行这样的优化。
        let data = new Article(Object.assign(req.body, { author: req.userData._id }))
        await data.save()
        res.status(200).json({
            code: 200,
            msg: "文章添加成功！",
            data
        })
    } catch (err) {
        next(err)
    }
}

//更新文章
exports.updateArticle = async (req, res, next) => {
    try {
        //1.更新
        const data = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
        //3.检测是否成功，并响应
        if (!data) {
            return res.status(400).json({
                code: 400,
                msg: "文章修改失败！"
            })
        }
        res.status(200).json({
            code: 200,
            msg: "文章修改成功！",
            data    //在返回数据时，有时会返回更新前的，有时会返回更新后的，所以需要在 data 里添加 { new:true }，这样返回的数据就是更新后的了
        })
    } catch (err) {
        next(err)
    }
}

//删除文章
exports.deleteArticle = async (req, res, next) => {
    try {
        //1.删除数据
        const data = await Article.findByIdAndDelete(req.params.id)
        //2.检测并响应
        if (!data) {
            return res.status(400).json({
                code: 400,
                msg: "文章删除失败！"
            })
        }
        //删除成功
        res.status(200).json({
            code: 200,
            msg: "文章删除成功！",
            data
        })
    } catch (err) {
        next(err)
    }
}