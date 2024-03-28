// controller构造器

//导入密码加密包 bcrypt
const bcrypt = require("bcryptjs")

//导入用户模块
const { User } = require("../model/user");

//引入问题模块
const { Question } = require("../model/questions");
const { Answer } = require("../model/answers");

//注册用户，通常使用 post 请求
exports.register = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        //body里拿到的是原始数据；validValue拿到的是经过校验处理过的数据
        // console.log(req.body);  
        // console.log(req.validValue);

        //用解构赋值的方法拿到 email
        let { email, password, name } = req.validValue
        //1.查询邮箱是否被注册过了（看能查到不，能查到就传给 user）
        let user = await User.findOne({ email })
        //2.如果被注册了，我们就不能再次初测，直接返回失败的响应
        if (user) {
            return res.status(400).json({
                code: 400,
                msg: "邮箱已经被注册过了，请重新输入",
                data: { email }
            })
        }
        //3.如果没有注册过，我们就进行注册，返回成功的响应
        //3.1加密
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        //3.2需要创建新的 User 实例
        user = new User({
            email,
            password,
            name
        })
        //3.3进行数据存储
        await user.save();
        //3.4成功的响应
        res.status(200).json({
            code: 200,
            msg: "注册成功",
            data: { email }
        })
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//获取用户列表
exports.getUserList = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        //1.查询用户
        let userList = await User.find();
        //2.如果不存在，返回失败的响应
        if (!userList) return res.status(400).json({
            code: 400,
            msg: "用户列表不存在"
        })
        //3.如果存在,返回成功的响应
        res.status(200).json({
            code: 200,
            msg: "用户列表查询成功",
            data: { userList } //将列表返回出去
        })
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//获取指定用户
// 通过获取 id ，获取指定用户
exports.getUser = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        //字段过滤，修改查询指定用户的逻辑
        //灵活获取用户其他信息
        const { fields = "" } = req.query;
        //console.log(field);
        //处理保存 field 的数据
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')  //以分号 ; 进行分割,然后用 .map() 进行遍历
        //
        const populateStr = fields.split(";").filter((f => f)).map(f => {
            if (f == "employments") {
                return 'employments.company employments.job'
            }
            if (f == "educations") {
                return "educations.school educations.major"
            }
            return f;  //如果都不是上面的，就返回自身
        }).join(' ')
        let userId = req.params.id
        let user = await User.findById(userId).select(selectFields).populate(populateStr)
        //如果不存在，返回失败响应
        if (!user) return res.status(400).json({
            code: 400,
            msg: "该用户不存在"
        })
        //如果存在，返回成功响应
        res.status(200).json({
            code: 200,
            msg: "查询指定用户成功",
            data: { user }
        })
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//编辑/修改指定用户
exports.updateUser = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        //获取用户
        let userId = req.params.id
        let body = req.body
        // console.log(body.password);   //加密之前的密码
        //把修改信息后的密码进行加密
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(body.password, salt);
        // console.log(body.password);   //加密之后的密码
        //1.查询用户并修改
        const data = await User.findByIdAndUpdate(userId, body)
        //2.查询失败
        if (!data) res.status(400).json({
            code: 400,
            msg: "更新用户失败"
        })
        //3.更新成功
        res.status(200).json({
            code: 200,
            msg: "更新用户成功",
            data: { body }
        })
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//删除指定用户
exports.deleteUser = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        let userId = req.params.id
        //查询并删除用户
        const data = await User.findByIdAndDelete(userId)
        //查询失败，返回失败响应
        if (!data) res.status(400).json({
            code: 400,
            msg: "删除用户失败",
            value: {
                _id: userId
            }
        })
        //查询并删除成功
        const body = req.body
        res.status(200).json({
            code: 200,
            msg: "删除用户成功",
            data: { body }
        })
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//获取关注列表
exports.listFollowing = async (req, res, next) => {
    try {
        //根据Id查询，获取Id
        let userId = req.params.id;
        const user = await User.findById(userId).select("+following").populate("following")
        //未找到关注列表
        if (!user) return res.status(400).json({
            code: 400,
            msg: "获取关注列表失败！"
        })
        // 获取关注列表成功
        res.status(200).json({
            code: 200,
            msg: "获取关注列表成功",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//关注用户
exports.follow = async (req, res, next) => {
    try {
        //根据Id查询
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+following")
        //如果已经关注过了，就直接return
        if (user.following.map(id => id.toString()).includes(req.params.id)) return res.status(400).json({    //如果关注列表已经有这个Id，就已经关注过了
            code: 400,
            msg: "已关注，关注失败！"
        })
        //如果之前没有关注过，那我们再关注
        user.following.push(req.params.id)   // 如果没关注就push到关注列表
        //关注成功进行保存
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "关注成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//取消关注用户
exports.unfollow = async (req, res, next) => {
    try {
        //登录后拿到Id
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+following")
        //获取已关注的用户的索引
        const index = user.following.map(id => id.toHexString()).indexOf(req.params.id)
        // 若没有关注，则取消失败
        if (index == -1) return res.status(400).json({
            code: 400,
            msg: "未关注，取消关注失败！"
        })
        //已经关注了，就进行取消操作
        user.following.splice(index, 1)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "取消关注成功！"
        })
    } catch (err) {
        next(err)
    }
}

//获取某个用户的粉丝列表
exports.listFollowers = async (req, res, next) => {
    try {
        //查询粉丝列表
        const users = await User.find({ following: req.params.id })
        //如果没有查询到
        if (!users) return res.status(400).json({
            code: 400,
            msg: "查询粉丝列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询粉丝列表成功！",
            data: users
        })
    } catch (err) {
        next(err)
    }
}

//关注话题
exports.followTopic = async (req, res, next) => {
    try {
        //根据Id查询
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+followingTopic") //followingTopic为model数据结构设置的
        //如果已经关注过了，就直接return
        if (user.followingTopic.map(id => id.toString()).includes(req.params.id)) return res.status(400).json({    //如果关注列表已经有这个Id，就已经关注过了
            code: 400,
            msg: "已关注，关注失败！"
        })
        //如果之前没有关注过，那我们再关注
        user.followingTopic.push(req.params.id)   // 如果没关注就push到关注列表
        //关注成功进行保存
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "关注成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//取消关注话题
exports.unfollowTopic = async (req, res, next) => {
    try {
        //登录后拿到Id
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+followingTopic")
        //获取已关注的用户的索引
        const index = user.followingTopic.map(id => id.toHexString()).indexOf(req.params.id)
        // 若没有关注，则取消失败
        if (index == -1) return res.status(400).json({
            code: 400,
            msg: "未关注，取消关注失败！"
        })
        //已经关注了，就进行取消操作
        user.followingTopic.splice(index, 1)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "取消关注成功！"
        })
    } catch (err) {
        next(err)
    }
}

//获取某个用户关注的话题列表
exports.listFollowingTopics = async (req, res, next) => {
    try {
        //查询用户ID
        let userId = req.params.id
        //根据用户Id 查找对应的关注列表
        const user = await User.findById(userId).select("+followingTopic").populate("followingTopic")
        //如果没有查询到
        if (!user) return res.status(400).json({
            code: 400,
            msg: "查询话题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询话题列表成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//获取某个用户的问题列表
exports.listQuestions = async (req, res, next) => {
    try {
        //根据用户Id 查找对应的问题列表
        const questions = await Question.find({ questioner: req.params.id })
        //如果没有查询到   Question.find({ questioner: req.params.id })
        if (!questions) return res.status(400).json({
            code: 400,
            msg: "查询问题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询问题列表成功！",
            data: questions
        })
    } catch (err) {
        next(err)
    }
}

//赞的
//赞（喜欢答案）
exports.likeAnswer = async (req, res, next) => {
    try {
        //根据Id查询
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+likingAnswers") //followingTopic为model数据结构设置的
        if (!user.likingAnswers.map(id => id.toString()).includes(req.params.id)) {
            user.likingAnswers.push(req.params.id)
            await user.save()
            await Answer.findByIdAndUpdate(req.params.id, { $inc: { voteCount: 1 } })
        }
        // 如果不引用掉，在点击两次赞或者踩的时候会报错：Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client。
        // res.status(200).json({
        //     code: 200,
        //     msg: "点赞成功！",
        //     data: user
        // })
        next()
    } catch (err) {
        next(err)
    }
}

//取消赞（取消喜欢答案）
exports.unlikeAnswer = async (req, res, next) => {
    try {
        //登录后拿到Id
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+likingAnswers")
        const index = user.likingAnswers.map(id => id.toHexString()).indexOf(req.params.id)
        if (index > -1) {
            user.likingAnswers.splice(index, 1)
            await user.save()
            await Answer.findByIdAndUpdate(req.params.id, { $inc: { voteCount: -1 } })
            // await Answer.findByIdAndUpdate(req.params.id, Math.max({$inc: {  voteCount: -1 }*1},0))
        }
        res.status(200).json({
            code: 200,
            msg: "操作成功！"
        })
    } catch (err) {
        next(err)
    }
}

//赞过的答案列表
exports.listLikingAnswers = async (req, res, next) => {
    try {
        //查询用户ID
        let userId = req.params.id
        //根据用户Id 查找对应的关注列表
        const user = await User.findById(userId).select("+likingAnswers").populate("likingAnswers")
        //如果没有查询到
        if (!user) return res.status(400).json({
            code: 400,
            msg: "查询赞列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询赞列表成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//踩的
//踩（不喜欢答案）
exports.dislikeAnswer = async (req, res, next) => {
    try {
        //根据Id查询
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+dislikingAnswers") //followingTopic为model数据结构设置的
        if (!user.dislikingAnswers.map(id => id.toString()).includes(req.params.id)) {
            user.dislikingAnswers.push(req.params.id)
            await user.save()
            await Answer.findByIdAndUpdate(req.params.id, { $inc: { dislikeVoteCount: -1 } })
        }
        // res.status(200).json({
        //     code: 200,
        //     msg: "踩踩成功！",
        //     data: user
        // })
        next()
    } catch (err) {
        next(err)
    }
}

//取消踩（取消不喜欢答案）
exports.undislikeAnswer = async (req, res, next) => {
    try {
        //登录后拿到Id
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+dislikingAnswers")
        const index = user.dislikingAnswers.map(id => id.toHexString()).indexOf(req.params.id)
        if (index > -1) {
            user.dislikingAnswers.splice(index, 1)
            await user.save()
            await Answer.findByIdAndUpdate(req.params.id, { $inc: { dislikeVoteCount: 1 } })
        }
        res.status(200).json({
            code: 200,
            msg: "操作成功！"
        })
    } catch (err) {
        next(err)
    }
}

//踩过的答案列表
exports.listDisLikingAnswers = async (req, res, next) => {
    try {
        //查询用户ID
        let userId = req.params.id
        //根据用户Id 查找对应的关注列表
        const user = await User.findById(userId).select("+dislikingAnswers").populate("dislikingAnswers")
        //如果没有查询到
        if (!user) return res.status(400).json({
            code: 400,
            msg: "查询踩列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询踩列表成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//收藏答案
exports.collectingAnswer = async (req, res, next) => {
    try {
        //根据Id查询
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+collectingAnswers") //followingTopic为model数据结构设置的
        //如果已经关注过了，就直接return
        if (user.collectingAnswers.map(id => id.toString()).includes(req.params.id)) return res.status(400).json({    //如果关注列表已经有这个Id，就已经关注过了
            code: 400,
            msg: "已收藏，再次收藏失败！"
        })
        //如果之前没有关注过，那我们再关注
        user.collectingAnswers.push(req.params.id)   // 如果没关注就push到关注列表
        //关注成功进行保存
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "收藏成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

//取消收藏答案
exports.uncollectingAnswer = async (req, res, next) => {
    try {
        //登录后拿到Id
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+collectingAnswers")
        //获取已收藏的用户的索引
        const index = user.collectingAnswers.map(id => id.toHexString()).indexOf(req.params.id)
        // 若没有收藏，则取消失败
        if (index == -1) return res.status(400).json({
            code: 400,
            msg: "未收藏，取消收藏失败！"
        })
        //已经收藏了，就进行取消操作
        user.collectingAnswers.splice(index, 1)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "取消收藏成功！"
        })
    } catch (err) {
        next(err)
    }
}

//获取某个用户收藏的答案列表
exports.listCollectingAnswers = async (req, res, next) => {
    try {
        //查询用户ID
        let userId = req.params.id
        //根据用户Id 查找对应的关注列表
        const user = await User.findById(userId).select("+collectingAnswers").populate("collectingAnswers")
        //如果没有查询到
        if (!user) return res.status(400).json({
            code: 400,
            msg: "查询收藏列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询收藏列表成功！",
            data: user
        })
    } catch (err) {
        next(err)
    }
}