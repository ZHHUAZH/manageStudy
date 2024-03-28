// 导入路由
const router = require("express").Router()  //链式调用
//导入用户信息校验函数
const { userValidator } = require("../model/user")
//导入校验中间件
const validator = require("../middleware/validate")
//引入controller代码构造组件
const user = require("../controller/user")

//引入鉴权中间件
const auth = require("../middleware/auth")

//引入检测用户是否存在中间件
const checkUserExist = require("../middleware/checkUserExist")

//引入检测话题是否存在中间件
const checkTopicExist = require("../middleware/checkTopicExist")

//引入检测答案是否存在中间件
const checkAnswerExist = require("../middleware/checkAnswerExist")

//注册用户，通常使用 post 请求
router.post("/", validator(userValidator), user.register)

//获取所有用户,  async：异步请求
router.get("/", user.getUserList)
//获取指定用户
// 通过获取 id ，获取指定用户
router.get("/:id", user.getUser)

//编辑/修改指定用户
router.patch("/:id", [auth, validator(userValidator)], user.updateUser)

//删除指定用户
router.delete("/:id", [auth, validator(userValidator)], user.deleteUser)

//获取关注列表
router.get("/:id/following", user.listFollowing)

//关注
router.put("/following/:id", [auth, checkUserExist], user.follow)

//取消关注
router.delete("/following/:id", [auth, checkUserExist], user.unfollow)

//获取某个用户的粉丝列表
router.get("/:id/followers", user.listFollowers)

//关注话题
router.put("/followingTopic/:id", [auth, checkTopicExist], user.followTopic)

//取消关注话题
router.delete("/followingTopic/:id", [auth, checkTopicExist], user.unfollowTopic)

//获取某个用户的关注话题列表
router.get("/:id/followingTopic", user.listFollowingTopics)

//获取某个用户的问题列表
router.get("/:id/questions", user.listQuestions)

//赞
router.put("/likingAnswers/:id", [auth, checkAnswerExist], user.likeAnswer, user.undislikeAnswer)

//取消赞
router.delete("/likingAnswers/:id", [auth, checkAnswerExist], user.unlikeAnswer)

//赞过的列表
router.get("/:id/likingAnswers", user.listLikingAnswers)  //id为用户Id

//踩
router.put("/dislikingAnswers/:id", [auth, checkAnswerExist], user.dislikeAnswer, user.unlikeAnswer)

//取消踩
router.delete("/dislikingAnswers/:id", [auth, checkAnswerExist], user.undislikeAnswer)

//踩过的答案列表
router.get("/:id/dislikingAnswers", user.listDisLikingAnswers)

//收藏
router.put("/collectingAnswer/:id", [auth, checkAnswerExist], user.collectingAnswer)

//取消收藏
router.delete("/collectingAnswer/:id", [auth, checkAnswerExist], user.uncollectingAnswer)

//收藏过的列表
router.get("/:id/collectingAnswer", user.listCollectingAnswers)


//最后将其导出
module.exports = router