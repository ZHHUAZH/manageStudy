## 后台管理系统学习

b站up主Coder-Dawn  (https://www.bilibili.com/video/BV13P4y1Z7dj?p=24&vd_source=48eb837d7dd42a2503ecdc857d558448)

### 1.项目创建

#### 1.1创建目录结构

* controller
* routes
* model
* middleware
* utils
* config
* package-lock.json
* package.json
* app.js

![image-20230108145648558](F:\vue3 同步学习\笔记\image-20230108145648558.png)

#### 1.2 初始化配置

* npm init -y   //生成配置文件
* npm i express    //安装express
* app.js



#### 1.3 npm i express

#### 1.4 postman端口：http://localhost:3000或者http://127.0.0.1:3000

#### 1.5安装nodemon

* npm install -g nodemon

### 2.基础中间件

#### 2.1处理中间件

* 处理json的中间件 

  ```js
   app.use(express.json())
  ```

#### 2.2处理跨域中间件

* 安装 npm i cors

```js
app.use(cors())
```

#### 2.3处理日志 中间件

* 安装npm i morgan

```js
app.use(morgan("dev"))
```

```js
//项目入口
// 导入config-index.js 里配置文件
const config = require("./config")
console.log(config)
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
app.use(express.json())
/* 2.处理跨域中间件 */
app.use(cors())
/* 处理日志 中间件,作用：限制端口后添加xxxx */
app.use(morgan("dev"))


//初始化代码
app.get("/", (req, res) => {
    res.send("Ok222111")
})
//演示新增接口
app.post("/", (req, res) => {
    console.log(req.body);
    res.send('Hello')
})
//监听 3000 端口
// app.listen(3000,() => {
//     console.log("项目启动成功");
// })
//自由端口
app.listen(config.app.port, () => {
    console.log('Running at http://localhost:${config.app.port}');
})
```



### 3.用户模块

#### 3.1用户路由搭建

* routes-->index

```js
//有很多路由，在此文件进行管理
const router = require("express").Router()

//进行管理
//用户接口
router.use("/user",require("./user"))

module.exports = router
```

* routes--->user

```JS
// 导入路由
const router = require("express").Router()  //链式调用

//注册用户，通常使用 post 请求
router.post("/", (req, res, next) => {
    res.send("注册")
})
//获取所有用户
router.get("/", (req, res, next) => {
    res.send("获取所有用户")
})
//获取指定用户
// 通过获取 id ，获取指定用户
router.get("/:id", (req, res, next) => {
    res.send("获取指定用户")
})
//编辑/修改指定用户
router.put("/:id", (req, res, next) => {
    res.send("编辑/修改指定用户")
})
//删除指定用户
router.delete("/:id", (req, res, next) => {
    res.send("删除指定用户")
})
//最后将其导出
module.exports = router
```

#### 3.2引入MongoDB数据库

* 安装

  npm i mongoose

* 在MongoDB数据库连接时报错：***数据库连接失败 MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017***。

解决办法：我的原因是MongoDB数据库程序没有下载安装，进行了很多操作都没有解决，最后按照下面CSDN中的方法操作后，MongoDB数据库可以连接，

[MongoDB的windows安装与Navicat连接_繁梦溪的博客-CSDN博客](https://blog.csdn.net/FG24151110876/article/details/109280110)

* 最后vscode运行成功

![image-20230108205431281](../../../vue3 同步学习/笔记/image-20230108205431281.png)

* config.js

```js
//灵活配置信息
// 导出配置信息
module.exports = {
    app:{
        port:process.env.port || 3000   //配置了环境变量，就会使用环境变量，如果没有配置环境变量，就默认使用 3000 端口
    },
    // 数据库配置
    db:{
        URL:process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/dwzhihu"
    }
}

```



* model--->index.js

```js
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
```

#### 3.3用户数据模块

* model-->user.js

```js
// 用户数据模型
//引入MongoDB
const mongoose = require("mongoose")
//创建mongodb的Schema,Schema是mongodb数据库自带的用来定义结构的代码，非常强大
//定义user用户的数据库结构
const userSchema = new mongoose.Schema({
    //邮箱
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
        unique: true
    },
    //用户名
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    //密码
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 16,
        select: false
    },
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    }
})
//创建 Model
const User = mongoose.model("User", userSchema)
//导出
module.exports = {
    //导出model
    User
}
```



* routes-->user.js

```js
//注册用户，通常使用 post 请求
router.post("/", (req, res, next) => {
    const user = new User({
        email:"333333",
        name:"李四",
        password:"111111"
    })
    user.save((err) => {
        if(err) return console.error(err)
        console.log("注册成功");
    })  
    res.send("注册")
})
//获取所有用户,  async：异步请求
router.get("/", async (req, res, next) => {
    const data = await User.find()
    res.send(data)
    console.log(data)
    // res.send("获取所有用户")
})
```

#### 3.4用户数据校验

* 安装

  npm i joi joi-objectid（安装两个模块，代码正确）

* model-->use.js

```js
//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        email: Joi.string().email().trim().lowercase().min(6).max(30).required(),
        name: Joi.string().min(2).max(20).required(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{6,16}$/).required(),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}
//导出
module.exports = {
    //导出model
    User,
    //导出用户校验规则
    userValidator
}
```



* 代码测试 routes-->user.js

```js
//导入用户信息校验函数
const {userValidator } = require("../model/user")

//注册用户，通常使用 post 请求
router.post("/", (req, res, next) => {
    console.log(userValidator(req.body));
    
    res.send("注册")
})
```

#### 3.5封装校验中间件，提示信息为英文

* middleware-->validata.js

```js
// 封装校验中间件
module.exports = (validator) => {
    return (req, res, next) => {
        const { error, value } = validator(req.body)
        console.log(error);
        if (error) {
            //说明数据有错，不能继续向后执行
            return res.status(400).json({
                code: 400,
                value: error._original,
                msg: error.details[0].message
            })
        }
        //数据信息校验通过，响应成功的信息
        req.validValue = value  //定义了一个变量validValue，如果验证成功，把value赋值给validValue
        next()
    }
}
```



* routes-->user.js

```js
// 导入路由
const router = require("express").Router()  //链式调用
//导入用户信息校验函数
const { userValidator } = require("../model/user")
//导入校验中间件
const validator = require("../middleware/validate")
//引入controller代码构造组件
const user = require("../controller/user")

//注册用户，通常使用 post 请求
router.post("/", validator(userValidator), (req, res, next) => {
    console.log(req.validValue, "校验后的数据");
    res.send("注册")
})

//获取所有用户,  async：异步请求
router.get("/", async (req, res, next) => {


    res.send("获取所有用户")
})

//获取指定用户
// 通过获取 id ，获取指定用户
router.get("/:id", (req, res, next) => {
    res.send("获取指定用户")
})

//编辑/修改指定用户
router.put("/:id", (req, res, next) => {
    res.send("编辑/修改指定用户")
})

//删除指定用户
router.delete("/:id", (req, res, next) => {
    res.send("删除指定用户")
})

//最后将其导出
module.exports = router
```

#### 3.6自定义错误提示信息

* model-->user.js

```js
//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        email: Joi.string().email().trim().lowercase().min(6).max(30).required().messages({
            "any.required": "缺少必要参数 email",
            "string.email": "email 格式错误",
            "string.min": "email 最少为6个字符",
            "string.max": "email 最多为30个字符",
        }),
        name: Joi.string().min(2).max(20).required().messages({
            "any.required": "缺少必要参数 name",
            "string.base": "name 必须为String类型",
            "string.min": "name 最少为2个字符",
            "string.max": "name 最多为20个字符",
        }),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{6,16}$/).required().messages({
            "any.required": "缺少必要参数 password",
            "string.min": "password 最少为6个字符",
            "string.max": "password 最多为16个字符",
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}
```

#### 3.7使用controller调整代码

* controller-->user.js

```JS
// controller构造器

//注册用户，通常使用 post 请求
exports.register = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("注册用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//获取所有用户,  async：异步请求
exports.getUserList = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("获取所有用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//获取指定用户
// 通过获取 id ，获取指定用户
exports.getUser = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("获取指定用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//编辑/修改指定用户
exports.updateUser = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("编辑/修改指定用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//删除指定用户
exports.deleteUser = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("删除指定用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};
```



* routes-->user.js

```js
// 导入路由
const router = require("express").Router()  //链式调用
//导入用户信息校验函数
const { userValidator } = require("../model/user")
//导入校验中间件
const validator = require("../middleware/validate")
//引入controller代码构造组件
const user = require("../controller/user")

//注册用户，通常使用 post 请求
router.post("/", validator(userValidator), user.register)

//获取所有用户,  async：异步请求
router.get("/", user.getUserList)

//获取指定用户
// 通过获取 id ，获取指定用户
router.get("/:id", user.getUser)

//编辑/修改指定用户
router.put("/:id", validator(userValidator), user.updateUser)

//删除指定用户
router.delete("/:id", validator(userValidator), user.deleteUser)

//最后将其导出
module.exports = router
```



#### 3.8错误处理中间件

* middleware-->error.js

```js
module.exports = (err, req, res, next) => {  //err 只能加在最前面
    //防止敏感信息泄露
    res.status(500).json({
        code: 500,
        msg: "服务端错误"
    })
    //测试时就在服务端输出错误信息
    console.log(err);
}
```



* app.js

```js
//引入路由中间件模块
app.use("/api", require("./routes"))

//注意点：中间件必须放在路由后面，否则不能生效
//引入错误处理的中间件
app.use(require("./middleware/error"))
```

#### 3.9注册功能的实现

#### 3.10密码加密处理

***/以下是注册功能的实现与密码加密处理/***

* 安装密码加密包

  npm i bcryptjs / npm i bcrypt

* controller-->user.js

```js
// controller构造器

//导入密码加密包 bcrypt
const bcrypt = require("bcryptjs")

//导入用户模块
const { User } = require("../model/user");

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
        //2.如果被注册了，我们就不能再次注册，直接返回失败的响应
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

        //3.2需要创建 User 实例
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

//获取所有用户,  async：异步请求
exports.getUserList = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("获取所有用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//获取指定用户
// 通过获取 id ，获取指定用户
exports.getUser = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("获取指定用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//编辑/修改指定用户
exports.updateUser = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("编辑/修改指定用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};

//删除指定用户
exports.deleteUser = (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        res.send("删除指定用户");
    } catch (err) {
        next(err) //到错误处理的中间件，处理错误
    }
};
```

#### 3.11用户列表与指定用户

* controller--->user.js

```js
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
        let userId = req.params.id
        let user = await User.findById(userId)
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
```

#### 3.12更新与删除用户

* controller--->user.js

```js
//编辑/修改指定用户
exports.updateUser = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        //获取用户
        let userId = req.params.id
        let body = req.body
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
```

### 4.登陆模块

#### 4.1登陆路由搭建

* routes-->auth.js

```js
//登陆路由
const router = require("express").Router()

const auth = require("../controller/auth")

//对登陆进行校验
const validator = require("../middleware/validate")
//对用户进行校验
const { userValidator } = require("../model/user")

router.post("/", validator(userValidator), auth.login)

module.exports = router
```



* routes-->index.js

```js
//有很多路由，在此文件进行管理
const router = require("express").Router()

//进行管理
//用户接口
router.use("/user",require("./user"))

//登陆接口
router.use("/auth",require("./auth"))

module.exports = router
```

#### 4.2登陆功能基本实现

* controller-->auth.js

```js
//引入用户模块
const { User } = require("../model/user")
//引入加密包 bcrypy
const bcrypt = require("bcryptjs")

exports.login = async (req, res, next) => {
    try {
        //首先获取到校验过后的数据
        const validValue = req.validValue
        //校验逻辑
        //1.检测用户是否存在
        let user = await User.findOne({ email: validValue.email }).select("+password")
        //2.如果用户不存在，那就直接返回失败的响应
        if (!user) {
            return res.status(400).json({
                code: 400,
                msg: "用户名或者密码错误"
            })
        }
        //3.如果用户存在，我们再来检测密码是否正确
        //第一个思路：拿到数据库的密码是加密的，所以需要先解密，然后进行比较，看是否正确
        //第二个思路：我们将用户目前登陆的密码（未加密的）也进行加密，然后那着2个加密的密码进行比较
        //采用第二个思路，因为反复提取数据库信息会加重服务器负担，并且有的加密是不能被解密的
        //compare中需要传入两个或三个参数，若其中一个为null/undefind，就会报错：data and hsah arguments required.
        let compareResult = await bcrypt.compare(validValue.password, user.password)
        //4.如果密码不正确，返回失败的响应
        if (!compareResult) {
            return res.status(400).json({
                code: 400,
                msg: "用户名或者密码错误"
            })
        }
        //5.以上校验完成，登陆成功，响应成功的信息
        res.status(200).json({
            code: 200,
            msg: "登陆成功"
        })
    } catch (err) {
        next(err)
    }
}
```

#### 4.3生成token

* 安装jwt密钥

  npm i jsonwebtoken

* 密钥获取，唯一标识数，建议在[在线随机UUID生成器 - UU在线工具 (uutool.cn)](https://uutool.cn/uuid/)生成

* model--->user.js

```js
//引入配置文件
const config = require("../config")
//引入jwt，生成token的工具
const jwt = require("jsonwebtoken")

//封装生成token的功能
userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id
    },
        config.secret,
        { expiresIn: "10d" }  //token过期时间 10天
    )
}

```



* controller-->auth.js

```js
 //5.以上校验完成，登陆成功，响应成功的信息
        res.status(200).json({
            code: 200,
            msg: "登陆成功",
            authorization: {
                token: user.generateToken()
            }
        })
```



* config--->index.js

```js
//灵活配置信息
// 导出配置信息
module.exports = {
    app: {
        port: process.env.port || 3000   //配置了环境变量，就会使用环境变量，如果没有配置环境变量，就默认使用 3000 端口
    },
    // 数据库配置
    db: {
        URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/dwzhihu"
    },
    //jwt密钥
    secret: "3850E31B-779F-A6D5-513A-894328050E5A"
}
```

#### 4.4接口鉴权中间件

* middleware--->auth.js

```js
// 鉴权处理

// 引入加密包jwt
const jwt = require("jsonwebtoken")
//引入配置文件
const config = require("../config")

module.exports = function (req, res, next) {
    //前端在请求接口的时候，需要在header（请求头）带上我们后端生成的token
    //1.保存数据（token）
    const token = req.header("Authorization")
    // return err
    console.log(token);
    //2.检测是否存在token
    if (!token) {
        return res.status(400).json({
            code: 400,
            msg: "Unauthorization 无Token"
        })
    }
    try {
        //3.当token存在的时候，验证是否有效。（token可能过期也可能错误），用jwt模块进行检验
        const userData = jwt.verify(token, config.secret)
        req.userData = userData
        next()
    } catch (err) {
        return res.status(401).json({
            code: 401,
            msg: "Unauthorization Token 无效"
        })
    }
}
```



* 测试鉴权中间件代码，在routes--->user.js

***注意点：***在进行测试时，需在postman提前登陆拿到token值，然后在poetman的header中添加Authorization与拿到的token，然后才能继续运行测试

```js
//引入鉴权中间件
const auth = require("../middleware/auth")

//获取所有用户,  async：异步请求
router.get("/",auth,  user.getUserList)
//获取指定用户
// 通过获取 id ，获取指定用户
router.get("/:id",auth, user.getUser)

//编辑/修改指定用户
router.put("/:id",[auth, validator(userValidator)], user.updateUser)

//删除指定用户
router.delete("/:id",[auth, validator(userValidator)], user.deleteUser)
```

### 5.文件上传功能

#### 5.1安装模块

* npm i multer --save multer

#### 5.2 搭建路由及功能实现

* routes--->upload.js

```js
// 文件上传 路由

const router = require("express").Router()

const home = require("../controller/upload.js")

//引入 multer 进行文件上传
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })
router.post("/", upload.single("file"), home.upload)

module.exports = router
```



* routes--->index.js

  * 导入  上传文件接口

  ```js
  //上传文件接口
  
  router.use("/upload",require("./upload"))
  ```



* controller--->upload.js

```js
exports.upload = (req, res, next) => {
    try {
        res.status(200).json({
            code: 200,
            msg: "上传成功",
            data: "http://127.0.0.1:3000/" + "upload/" + req.file.originalname   //需要用静态资源托管才能在浏览器中打开
        })
    } catch (err) {
        next(err)
    }
}
```

* app.js

```js
//静态资源（图片等文件）托管,
app.use(express.static("public"))
```

### 6.个资料模块

#### 6.1个人资料模块需求分析

![image-20230109224212964](../../../vue3 同步学习/笔记/image-20230109224212964.png)

![image-20230109224300522](../../../vue3 同步学习/笔记/image-20230109224300522.png)



#### 6.2个人资料数据模块设计

* model--->user.js

```js
const userSchema = new mongoose.Schema({
    //头像/头像
    avatar_url: {
        type: String
    },
    //性别
    gender: {
        type: String,
        enmu: ["male", "female"],   //enmu：枚举
        default: "male",
        required: true
    },
    //一句话介绍
    hadline: {
        type: String
    },
    //居住地
    locations: {
        type: [{ type: String }]
    },
    //行业
    business: {
        type: String
    },
    //职业
    employments: {
        type: [{
            company: { type: String },
            job: { type: String }
        }]
    },
    //教育经历
    education: {
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year:{type:Number},
            grations_year:{type:Number}
        }]
    }
})
```



#### 6.3数据模块校验

* model--->user.js

```js
// 用户数据模型
//引入配置文件
const config = require("../config")
//引入jwt，生成token的工具
const jwt = require("jsonwebtoken")

//引入MongoDB
const mongoose = require("mongoose")
//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)
//创建mongodb的Schema,Schema是mongodb数据库自带的用来定义结构的代码，非常强大
//定义user用户的数据库结构
const userSchema = new mongoose.Schema({
    //邮箱
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
        unique: true
    },
    //用户名
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    //密码
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1000,
        select: false
    },
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },

    //头像/头像
    avatar_url: {
        type: String
    },
    //性别
    gender: {
        type: String,
        enmu: ["male", "female"],   //enmu：枚举
        default: "male",
        required: true
    },
    //一句话介绍
    headline: {
        type: String,
        maxlength: 100
    },
    //居住地
    locations: {
        type: [{ type: String }],
    },
    //行业
    business: {
        type: String
    },
    //职业
    employments: {
        type: [{
            company: { type: String },
            job: { type: String }
        }]
    },
    //教育经历
    educations: {
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }]
    }
})

//封装生成token的功能
userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id
    },
        config.secret,
        { expiresIn: "10d" }  //token过期时间 10天
    )
}

//创建 Model
const User = mongoose.model("User", userSchema)
//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        email: Joi.string().email().trim().lowercase().min(6).max(30).required().messages({
            "any.required": "缺少必要参数 email",
            "string.email": "email 格式错误",
            "string.min": "email 最少为6个字符",
            "string.max": "email 最多为30个字符",
        }),
        name: Joi.string().min(2).max(20).required().messages({
            "any.required": "缺少必要参数 name",
            "string.base": "name 必须为String类型",
            "string.min": "name 最少为2个字符",
            "string.max": "name 最多为20个字符",
        }),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{6,16}$/).required().messages({
            "any.required": "缺少必要参数 password",
            "string.min": "password 最少为6个字符",
            "string.max": "password 最多为16个字符",
        }),
        _id: Joi.objectId(),

        // 头像字段校验
        avatar_url: Joi.string().messages({
            "string.base": "图像地址必须为string类型"
        }),
        //性别校验
        gender: Joi.any().valid("male", "female").default("male").messages({
            "any.only": "只能传入male或者fanale"
        }),
        //一句话介绍校验
        headline: Joi.string().max(100).messages({
            "string.base": "headline 必须为 string 类型",
            "string.max": "headline 最多100个字符"
        }),
        //居住地校验
        locations: Joi.array().items(Joi.string()).messages({
            "array.base": "locations 必须为数组",
            "string.base": "数组中必须传入 string 类型"
        }),
        //行业校验
        business: Joi.string().messages({
            "string.base": "business 必须为 string 类型"
        }),
        //职业校验
        employments: Joi.array().items(
            Joi.object().keys({
                company: Joi.string(),
                job: Joi.string()
            })
        ).messages({
            "array.base": "employments 必须为数组",
            "object.unknown": "传入的数据有误"
        }),
        //教育经历校验
        educations: Joi.array().items(
            Joi.object().keys(
                {
                school: Joi.string(),
                major: Joi.string(),
                diploma: Joi.number().valid(1, 2, 3, 4, 5),
                entrance_year: Joi.number(),
                graduation_year: Joi.number()
            })
        ).messages({
            "array.base": "educations 必须为数组",
            "object.unknown": "传入的数据有误",
            "any.only": "diploma 只能从1,2,3,4,5 中进行选取",
            "string.base": "school 与 major 只能是 string 类型",
            "number.base": "entrance_year 与 grations_year 只能是 number 类型"
        })
    })
    return schema.validate(data)
}
//导出
module.exports = {
    //导出model
    User,
    //导出用户校验规则
    userValidator
}
```



#### 6.4字段过滤

##### 6.4.1 修改 Model---->user.js模型，将没有必要显示出来的字段进行隐藏

* 在每个字段下面加  

  select:false

  隐藏

##### 6.4.2 修改查询指定用户的逻辑

* controller--->user.js

```js
//获取指定用户
// 通过获取 id ，获取指定用户
exports.getUser = async (req, res, next) => {
    //使用try{}catch(){}捕捉逻辑书写中的错误
    try {
        //字段过滤，修改查询指定用户的逻辑
        //灵活获取用户其他信息
        const { field = "" } =req.query;
        //console.log(field);
        //处理保存 field 的数据
        const selectFields = field.split(";").filter(f => f).map(f => " + " + f).join("")  //以分号 ; 进行分割,然后用 .map() 进行遍历
        //
        let userId = req.params.id
        let user = await User.findById(userId).select(selectFields)
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
```

##### 6.5 优化

***      修改用户信息时，新改的密码在存入数据库时，是明码存入，没有加密处理，在后续登陆时也会登录不上去，提示用户名或密码错误***

* controller---->user.js

```js
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
```



### 7. 关注与粉丝模块

#### 7.1 需求分析

* 关注、取消关注
* 获取关注的人、粉丝列表

#### 7.2 数据模块设计与校验

* model--->user.js

```js
const userSchema = new mongoose.Schema({
    //关注与粉丝部分
    //关注的用户
    following:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,  //查询时，通过ID关联到用户
            ref:"User"
        }],
        select:false
    }
})

function userValidator(data) {
    const schema = Joi.object({
//教育经历校验
        educations: Joi.array().items(
            Joi.object().keys({
                school: Joi.string(),
                major: Joi.string(),
                diploma: Joi.number().valid(1, 2, 3, 4, 5),
                entrance_year: Joi.number(),
                graduation_year: Joi.number()
            })
        ).messages({
            "array.base": "educations 必须为数组",
            "object.unknown": "传入的数据有误",
            "any.only": "diploma 只能从1,2,3,4,5 中进行选取",
            "string.base": "school 与 major 只能是 string 类型",
            "number.base": "entrance_year 与 grations_year 只能是 Number 类型",
            "object.unknown":"传入的数据有误"
        }),

        //关注校验
        following:Joi.array().items(
            Joi.object().keys({
                type:Joi.objectId()
            })
        ).messages({
            "array.base": "following 必须为数组"
        })
    })
    return schema.validate(data)
}
```



#### 7.3 获取关注列表接口

* routes--->user.js

```js
//获取关注列表路由
router.get("/:id/following",user.listFollowing)
```

* controller--->user.js

```js
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
```



#### 7.4 关注与取消关注

* routes--->user.js

```js
//关注
router.put("/following/:id",auth,user.follow)

//取消关注
router.delete("/following/:id",auth,user.unfollow)

```

* controller--->user.js

```js
//关注
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

//取消关注
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
```



#### 7.5 获取粉丝列表

* routes--->user.js

```js
//获取某个用户的粉丝列表
router.get("/:id/followers",user.listFollowers)
```

* controller--->user.js

```js
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
```



#### 7.6 检测用户是否存在 的 中间件

*** 以上代码在关注某个用户时，若被关注的用户 ID 输入错误，后台会直接报500的错误，不能显示被关注的用户不存在，为解决此问题，采用检测用户是否存在的中间件***

* middleware--->checkUserExist.js

```js
//导入用户模块
const { User } = require("../model/user")

// 检测用户是否存在中间件
module.exports = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({
        code: 404,
        msg: "该用户不存在！"
    })
    next();
}
```

*** 非必要模块， 此代码还存在bug，就是 ID 位数缺少或者增加都会导致程序（app.js）崩溃***

* routes--->user.js

```js
//引入检测用户是否存在中间件
const checkUserExist = require("../middleware/checkUserExist")


//关注
router.put("/following/:id", [auth, checkUserExist], user.follow)
//取消关注
router.delete("/following/:id", [auth, checkUserExist], user.unfollow)
```

### 8. 话题模块

#### 8.1 需求分析

* * * * * * * * * *

#### 8.2 数据模块与校验

* model---->topics.js

```js
//引入MongoDB
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//创建mongodb的Schema,Schema是mongodb数据库自带的用来定义结构的代码，非常强大
//定义 topic 的数据库结构
const topicSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //话题的名称
    name: {
        type: String,
        required: true
    },
    //图像
    avatar_url: {
        type: String,
    },
    //简介
    introduction: {
        type: String,
        maxlength: 500,
        select: false
    }
})

//创建 Model
const Topic = mongoose.model("Topic", topicSchema)

//创建信息内容校验规则对象,将其封装为一个函数。  
function topicValidator(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
        avatar_url: Joi.string(),
        introduction: Joi.string().max(500)
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Topic,
    //导出话题校验规则
    topicValidator
}
```



#### 8.3 话题列表与特定话题查询

* routes---->topics.js

```js
// 导入路由
const router = require("express").Router()  //链式调用

//引入controller代码构造组件
const topic = require("../controller/topics")

//获取话题列表 配置
router.get("/", topic.getTopicsList)

// 获取指定话题 配置
router.get("/:id", topic.getTopic)

module.exports = router
```



* controller---->topics.js

```js
//导入话题模型（数据结构）
const { Topic } = require("../model/topics")

//获取话题列表
exports.getTopicsList = async (req, res, next) => {
    try {
        const topicsList = await Topic.find()
        if (!topicsList) return res.status(400).json({
            code: 400,
            msg: "获取话题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题列表成功！",
            data: topicsList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定话题
exports.getTopic = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        const topic = await Topic.findById(req.params.id).select(selectFields)
        if (!topic) return res.status(400).json({
            code: 400,
            msg: "获取话题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题成功",
            data: topic
        })
    } catch (err) {
        next(err)
    }
}
```



* routes---->index.js

```js
//话题模块接口
router.use("/topics",require("./topics"))
```



#### 8.4 话题的创建与更新

* controller---->topics.js

```js
//创建话题
exports.createTopic = async (req, res, next) => {
    try {
        //1.检测话题是否存在
        const data = req.body  //body 是用户输入的数据
        let topic = await Topic.findOne(data)
        //2.若已经存在，就不创建了
        if (topic) return res.status(400).json({
            code: 400,
            msg: "该话题已存在！",
            value: data
        })
        //3.创建我们的话题数据，并返回响应
        topic = new Topic(data)
        await topic.save()
        res.status(200).json({
            code: 200,
            msg: "话题创建成功！",
            data: data
        })
    } catch (err) {
        next(err)
    }
}

//更新话题
exports.updateTopic = async (req, res, next) => {
    try {
        let topicId = req.params.id
        const data = await Topic.findByIdAndUpdate(topicId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新话题失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新话题成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}
```



* routes----->topics.js

```js
//创建话题
router.post("/", [auth, validator(topicValidator)], topic.createTopic)

//更新/修改话题
router.patch("/:id", [auth, validator(topicValidator)], topic.updateTopic)
```



#### 8.5 分页功能

* controller---->topics.js

```js
//获取话题列表
exports.getTopicsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。

        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const topicsList = await Topic.find().limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据
        if (!topicsList) return res.status(400).json({
            code: 400,
            msg: "获取话题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题列表成功！",
            data: topicsList
        })
    } catch (err) {
        next(err)
    }
}
```



#### 8.6 模糊搜索

* controller---->topics.js
  * 增加关键词搜索：{ name: new RegExp(req.query.keyword) }

```js
const topicsList = await Topic.find({ name: new RegExp(req.query.keyword) }).limit(perPage).skip(page * perPage)
```



#### 8.7 用户属性中的话题引用

##### 8.7.1 改造 user 数据模型结构以及校验规则

* model---->user.js

```js
// 用户数据模型
//引入配置文件
const config = require("../config")
//引入jwt，生成token的工具
const jwt = require("jsonwebtoken")

//引入MongoDB
const mongoose = require("mongoose")
//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)
//创建mongodb的Schema,Schema是mongodb数据库自带的用来定义结构的代码，非常强大
//定义user用户的数据库结构
const userSchema = new mongoose.Schema({
    //邮箱
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
        unique: true
    },
    //用户名
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    //密码
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1000,
        select: false
    },
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },

    //个人资料部分
    //头像/图像
    avatar_url: {
        type: String,
        select: false
    },
    //性别
    gender: {
        type: String,
        enmu: ["male", "female"],   //enmu：枚举
        default: "male",
        required: true
    },
    //一句话介绍
    headline: {
        type: String,
        maxlength: 100
    },
    //居住地
    locations: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
        select: false
    },
    //行业
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        select: false
    },
    //职业经历
    employments: {
        type: [{
            company: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            job: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }
        }],
        select: false
    },
    //教育经历
    educations: {
        type: [{
            school: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            major: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    },

    //关注与粉丝部分
    //关注的用户
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,  //查询时，通过ID关联到用户
            ref: "User"
        }],
        select: false
    }
})

//封装生成token的功能
userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id
    },
        config.secret,
        { expiresIn: "10d" }  //token过期时间 10天
    )
}

//创建 Model
const User = mongoose.model("User", userSchema)
//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        email: Joi.string().email().trim().lowercase().min(6).max(30).required().messages({
            "any.required": "缺少必要参数 email",
            "string.email": "email 格式错误",
            "string.min": "email 最少为6个字符",
            "string.max": "email 最多为30个字符",
        }),
        name: Joi.string().min(2).max(20).required().messages({
            "any.required": "缺少必要参数 name",
            "string.base": "name 必须为String类型",
            "string.min": "name 最少为2个字符",
            "string.max": "name 最多为20个字符",
        }),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{6,16}$/).required().messages({
            "any.required": "缺少必要参数 password",
            "string.min": "password 最少为6个字符",
            "string.max": "password 最多为16个字符",
        }),
        _id: Joi.objectId(),

        // 头像字段校验
        avatar_url: Joi.string().messages({
            "string.base": "图像地址必须为string类型"
        }),
        //性别校验
        gender: Joi.any().valid("male", "female").default("male").messages({
            "any.only": "只能传入male或者fanale"
        }),
        //一句话介绍校验
        headline: Joi.string().max(100).messages({
            "string.base": "headline 必须为 string 类型",
            "string.max": "headline 最多100个字符"
        }),
        //居住地校验
        locations: Joi.array().items(Joi.objectId()).messages({
            "array.base": "locations 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
        //行业校验
        business: Joi.objectId().messages({
            "string.base": "business 必须为 objectId 类型"
        }),
        //职业校验
        employments: Joi.array().items(
            Joi.object().keys({
                company: Joi.objectId(),
                job: Joi.objectId()
            })
        ).messages({
            "array.base": "employments 必须为数组",
            "object.unknown": "传入的数据有误"
        }),
        //教育经历校验
        educations: Joi.array().items(
            Joi.object().keys({
                school: Joi.objectId(),
                major: Joi.objectId(),
                diploma: Joi.number().valid(1, 2, 3, 4, 5),
                entrance_year: Joi.number(),
                graduation_year: Joi.number()
            })
        ).messages({
            "array.base": "educations 必须为数组",
            "object.unknown": "传入的数据有误",
            "any.only": "diploma 只能从1,2,3,4,5 中进行选取",
            "string.base": "school 与 major 只能是 objectId 类型",
            "number.base": "entrance_year 与 grations_year 只能是 Number 类型",
            "object.unknown": "传入的数据有误"
        }),

        //关注校验
        following: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            })
        ).messages({
            "array.base": "following 必须为数组"
        })
    })
    return schema.validate(data)
}
//导出
module.exports = {
    //导出model
    User,
    //导出用户校验规则
    userValidator
}
```



* controller----> user.js

```js
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
        //部分信息以话题形式展现
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
```



#### 8.8 话题关注、取消、列表

* model---->user.js

```js
//话题部分
    followingTopic:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,  //查询时，通过ID关联到用户
            ref: "Topic"
        }],
        select: false
    }
        
//话题校验
        followingTopic: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            })
        ).messages({
            "array.base": "followingTopic 必须为数组类型"
        })
```



* controller---->user,js

```js
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
```



* routes---->user.js

```js
//引入检测话题是否存在中间件
const checkTopicExist = require("../middleware/checkTopicExist")

//关注话题
router.put("/followingTopic/:id", [auth, checkTopicExist], user.followTopic)

//取消关注话题
router.delete("/followingTopic/:id", [auth, checkTopicExist], user.unfollowTopic)

//获取某个用户的关注话题列表
router.get("/:id/followingTopic", user.listFollowingTopics)
```



* middleware---->checkTopicExist.js

```js
//导入话题模块
const { Topic } = require("../model/topics")

// 检测话题是否存在中间件
module.exports = async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({
        code: 404,
        msg: "该话题不存在！"
    })
    next();
}
```



#### 8.9 话题的粉丝

* controller---->topics.js

```js
//导入用户模型
const { User } = require("../model/user")

//话题的粉丝
exports.listTopicFollowers = async (req, res, next) => {
    try {
        const users = await User.find({ followingTopic: req.params.id })
        if (!users) return res.status(400).json({
            code: 400,
            msg: "查询话题粉丝失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询话题粉丝成功！",
            data: users
        })
    } catch (err) {
        next(err)
    }
}
```



* routes---->topics.js

```js
//导入话题是否存在的校验
const checkTopicExist = require("../middleware/checkTopicExist")

//获取话题粉丝
router.get("/:id/followers", checkTopicExist, topic.listTopicFollowers)
```

### 9. 问题模块

#### 9.1 需求分析

* 问题的增删改查
* 用户的问题列表（一对多）
* 话题的问题列表、问题的话题列表（多对多）

#### 9.2 （用户—问题）数据结构与校验规则

* model---->questions.js

```js
//问题的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 questions 结构
const questionSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //标题
    title: {
        type: String,
        required: true
    },
    //描述
    description: {
        type: String
    },
    //提出问题的人
    questioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    }

})

//创建 Model
const Question = mongoose.model("Question", questionSchema)
//问题数据 校验规则
function questionValidator(data) {
    const schema = Joi.object({
        title: Joi.String().required(),
        description: Joi.String(),
        questioner: Joi.objectId()
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Question,
    //导出用户校验规则
    questionValidator
}
```



#### 9.3 （用户—问题）封装2个中间件

* middleware---->checkQuestionsExist.js

```js
//导入问题模块
const { Question } = require("../model/questions")

// 检测问题是否存在中间件
module.exports = async (req, res, next) => {
    const questions = await Question.findById(req.params.id).select("+questioner");
    if (!questions) return res.status(404).json({
        code: 404,
        msg: "该问题不存在！"
    })
    next();
}
```



* middleware---->checkQuestioner.js

```js
//导入问题模块
const { Question } = require("../model/questions")

// 检测提问人是否存在中间件
module.exports = async (req, res, next) => {
    const question = await Question.findById(req.params.id).select("+questioner");
    if (question.questioner.toString() !== req.userData._id) {   //通过 Id 比较提出问题的人与登陆的人是否为同一个人
        return res.status(400).json({
            code: 400,
            msg: "没有权限！"
        })
    }
    next();
}
```



#### 9.4 （用户—问题）问题的增删改查

* controller---->question.js

```js
//问题的增删改查

//导入问题模型（数据结构）
const { Question } = require("../model/questions")

//导入用户模型
const { User } = require("../model/user")

//获取问题列表
exports.getQuestionsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const questionList = await Question.find({ $or: [{ title: keyword }, { description: keyword }] }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!questionList) return res.status(400).json({
            code: 400,
            msg: "获取问题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题列表成功！",
            data: questionList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定问题
exports.getQuestion = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        const question = await Question.findById(req.params.id).select(selectFields).populate("questioner")
        if (!question) return res.status(400).json({
            code: 400,
            msg: "获取问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题成功",
            data: question
        })
    } catch (err) {
        next(err)
    }
}

//新增问题
exports.createQuestion = async (req, res, next) => {
    try {
        //直接创建问题，因为多个人可以提出同一个问题
        const question = new Question({ ...req.body, questioner: req.userData._id })  //在里面传入参数：req.body(提出的问题)、questioner(提出问题人的ID)
        await question.save()
        res.status(200).json({
            code: 200,
            msg: "问题创建成功！",
            data: question
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改问题
exports.updateQuestion = async (req, res, next) => {
    try {
        let questionId = req.params.id
        const data = await Question.findByIdAndUpdate(questionId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新问题失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新问题成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除问题
exports.deleteQuestion = async (req, res, next) => {
    try {
        const data = await Question.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除问题成功！"
        })
    } catch (err) {
        next(err)
    }
}
```



* routes---->questions.js

```js
const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")
//导入两个封装的校验中间件
const checkQuestionsExist = require("../middleware/checkQuestionsExist")
const checkQuestioner = require("../middleware/checkQuestioner")
//导入用户信息校验函数
const { questionValidator } = require("../model/questions")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const question = require("../controller/questions")

//获取问题列表 配置
router.get("/", question.getQuestionsList)

//获取指定问题 配置
router.get("/:id", checkQuestionsExist, question.getQuestion)

//创建问题
router.post("/", [auth, validator(questionValidator)], question.createQuestion)

//更新/修改问题
router.patch("/:id", [auth, validator(questionValidator), checkQuestionsExist, checkQuestioner], question.updateQuestion)

//删除问题
router.delete("/:id", [auth, checkQuestionsExist, checkQuestioner], question.deleteQuestion)

//最后将其导出
module.exports = router
```



* routes---->index.js

```js
//问题模块接口
router.use("/questions",require("./quesyions"))
```



#### 9.5 （用户—问题）用户的问题列表

* routes---->user.js

```js
//获取某个用户的问题列表
router.get("/:id/questions", user.listQuestions)
```



* controller---->user.js

```js
//引入问题模块
const { Question } = require("../model/questions")


//获取某个用户的问题列表
exports.listQuestions = async (req, res, next) => {
    try {
        //根据用户Id 查找对应的问题列表
        const questions = await Question.find({ questioner: req.params.id })
        //如果没有查询到
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
```



#### 9.6（问题—话题）问题的话题列表

* model---->questions.js

```js
//问题的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 questions 结构
const questionSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //标题
    title: {
        type: String,
        required: true
    },
    //描述
    description: {
        type: String
    },
    //提出问题的人
    questioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },

    //话题
    topics: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"  //与话题模块进行关联
        }],
        select: false
    }
})

//创建 Model
const Question = mongoose.model("Question", questionSchema)
//问题数据 校验规则
function questionValidator(data) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        questioner: Joi.objectId(),

        topics: Joi.array().items(Joi.objectId())
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Question,
    //导出用户校验规则
    questionValidator
}
```



* controler---->questions.js    只增加了  topics

```js
//获取指定问题
exports.getQuestion = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        const question = await Question.findById(req.params.id).select(selectFields).populate("questioner topics")   //只增加了 -->topics
        if (!question) return res.status(400).json({
            code: 400,
            msg: "获取问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题成功",
            data: question
        })
    } catch (err) {
        next(err)
    }
}
```



#### 9.7 （问题—话题）话题的问题列表

* controller---->topics.js

```js
//话题的问题列表
exports.listQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find({ topics: req.params.id })
        if (!questions) return res.status(400).json({
            code: 400,
            msg: "查找失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查找成功！",
            data: questions
        })
    } catch (err) {
        next(err)
    }
}
```



* routes---->topics.js

```js
//话题的问题列表
router.get("/:id/questions",checkTopicExist,topic.listQuestions)

```



### 10. 答案模块

#### 10.1 需求分析

* 增删改查
* 问题—答案、用户—答案（一对多）
* 赞、踩（互斥）
* 收藏

#### 10.2 答案数据模型与校验

* model---->answer.js

```js
//答案的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 answers 结构
const answerSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //内容
    content: {
        type: String,
        required: true
    },
    //回答的人
    answerer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    //问题的Id，每一个回答都需要对应一个问题
    questionId: {
        type: String
    }
})

//创建 Model
const Answer = mongoose.model("Answer", answerSchema)
//答案数据 校验规则
function answerValidator(data) {
    const schema = Joi.object({
        content: Joi.string().required(),
        answerer: Joi.objectId(),
        questionId: Joi.string()
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Answer,
    //导出答案校验规则
    answerValidator
}
```



#### 10.3 再次封装2个中间件

* middleware---->checkAnswerer.js

```js
//导入答案模块
const { Answer } = require("../model/answers")

// 检测回答人 中间件
module.exports = async (req, res, next) => {
    const answer = await Answer.findById(req.params.id).select("+answerer");
    if (answer.answerer.toString() !== req.userData._id) {   //通过 Id 比较回答问题的人与登陆的人是否为同一个人
        return res.status(400).json({
            code: 400,
            msg: "没有权限！"
        })
    }
    next();
}
```



* middleware---->checkAnswerExist.js

```js
//导入答案模块
const { Answer } = require("../model/answers")

// 检测答案是否存在 中间件
module.exports = async (req, res, next) => {
    const answers = await Answer.findById(req.params.id).select("+answerer");
    if (!answers) return res.status(404).json({
        code: 404,
        msg: "该答案不存在！"
    })
    //判断问题下有没有答案
    if (answers.questionId !== req.params.questionId) {
        return res.status(400).json({
            code: 400,
            msg: "该问题下没有答案！"
        })
    }
    next();
}
```



#### 10.4 增删改查业务（本质上是二级嵌套）

******

*  *** 二级嵌套：先是问题，在问题下面才是答案***

* controller---->answers.js

```js
//答案的增删改查

//导入答案模型（数据结构）
const { Answer } = require("../model/answers")

//获取答案列表
exports.getAnswersList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const answersList = await Answer.find({ content: keyword, questionId: req.params.questionId }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!answersList) return res.status(400).json({
            code: 400,
            msg: "获取答案列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取答案列表成功！",
            data: answersList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定答案
exports.getAnswer = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join(" ")
        const answer = await Answer.findById(req.params.id).select(selectFields).populate("answerer")
        if (!answer) return res.status(400).json({
            code: 400,
            msg: "获取答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取答案成功",
            data: answer
        })
    } catch (err) {
        next(err)
    }
}

//新增答案
exports.createAnswer = async (req, res, next) => {
    try {
        //直接创建问题，因为多个人可以提出同一个问题
        const answer = new Answer({ ...req.body, answerer: req.userData._id, questionId: req.params.questionId })  //在里面传入参数：req.body(回答的答案)、questionId(提出问题人的ID)、answerer：回答问题的人
        await answer.save()
        res.status(200).json({
            code: 200,
            msg: "答案创建成功！",
            data: answer
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改答案
exports.updateAnswer = async (req, res, next) => {
    try {
        let answerId = req.params.id
        const data = await Answer.findByIdAndUpdate(answerId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新答案失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新答案成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除答案
exports.deleteAnswer = async (req, res, next) => {
    try {
        const data = await Answer.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除答案成功！"
        })
    } catch (err) {
        next(err)
    }
}
```



* routes---->answers.js

```js
const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")
//导入两个封装的校验中间件
const checkAnswerExist = require("../middleware/checkAnswerExist")
const checkAnswerer = require("../middleware/checkAnswerer")
//导入用户信息校验函数
const { answerValidator } = require("../model/answers")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const answer = require("../controller/answers")

//获取答案列表 配置
router.get("/", answer.getAnswersList)

//获取指定答案 配置
// router.get("/:id", checkAnswerExist, answer.getAnswer)
router.get("/:id", answer.getAnswer)

//创建/新增答案
router.post("/", [auth, validator(answerValidator)], answer.createAnswer)

//更新/修改答案
router.patch("/:id", [auth, validator(answerValidator), checkAnswerExist, checkAnswerer], answer.updateAnswer)

//删除答案
router.delete("/:id", [auth, checkAnswerExist, checkAnswerer], answer.deleteAnswer)

//最后将其导出
module.exports = router
```



* routes---->index.js

```js
//答案模块接口   (二级嵌套路由，一对多的关系)
router.use("/questions/:questionId/answers",require("./answers"))
```



#### 10.5 赞和踩逻辑

* ***答案的赞***

* model---->answers.js

```js
//问题的Id，每一个回答都需要对应一个问题
    questionId: {
        type: String
    },

    //赞的数量
    voteCount: {
        type: Number,
        default: 0,
        required: true
    }

//答案数据 校验规则
function answerValidator(data) {
    const schema = Joi.object({
        content: Joi.string().required(),
        answerer: Joi.objectId(),
        questionId: Joi.string(),
        voteCount: Joi.number()
    })
    return schema.validate(data)
}
```



* model---->user.js

```js
const userSchema = new mongoose.Schema({
     //用户的赞
    likingAnswers: {
        Type: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Answer"
        }],
        select:false
    },
    //用户的踩
    dislikingAnswers: {
        Type: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Answer"
        }],
        select:false
    }
})

//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        
        //赞校验
        likingAnswers: Joi.array().items(Joi.objectId()).messages({
            "array.base": "likingAnswers 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
        //踩校验
        dislikingAnswers: Joi.array().items(Joi.objectId()).messages({
            "array.base": "likingAnswers 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
    })
    return schema.validate(data)
}
```



* controller---->user.js

```js
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
            await Answer.findByIdAndUpdate(req.params.id, { $inc: {  voteCount: 1 } })
        }
        //如果不引用掉，在点击两次赞或者踩的时候会报错：Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client。
        //res.status(200).json({
        //    code: 200,
        //    msg: "点赞成功！",
        //    data: user
        //})
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
        }
        //如果不引用掉，在点击两次赞或者踩的时候会报错：Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client。
        //res.status(200).json({
        //    code: 200,
        //    msg: "踩踩成功！",
        //   data: user
        //})
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
```



* routes---->user.js

```js
//赞
router.put("/likingAnswers/:id", [auth, checkAnswerExist], user.likeAnswer)

//取消赞
router.delete("/likingAnswers/:id", [auth, checkAnswerExist], user.unlikeAnswer)

//赞过的列表
router.get("/:id/likingAnswers", user.listLikingAnswers)

//踩
router.put("/dislikingAnswers/:id", [auth, checkAnswerExist], user.dislikeAnswer)

//取消踩
router.delete("/dislikingAnswers/:id", [auth, checkAnswerExist], user.undislikeAnswer)

//踩过的答案列表
router.get("/:id/dislikingAnswers", user.listDisLikingAnswers)
```



#### 10.6 收藏答案

* model---->user.js

```js
const userSchema = new mongoose.Schema({
    //收藏答案
    collectingAnswers: {
        type: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Answer"
        }],
        select:false
    }
})


//创建信息内容校验规则对象,将其封装为一个函数。  
// lowercase：转换为小写字母；
// 正则表达式：[a-zA-Z0-9]：允许为 小写字母、大写字母、0-9；{6,16}：长度为6-16位
function userValidator(data) {
    const schema = Joi.object({
        //收藏校验
        collectingAnswers: Joi.array().items(Joi.objectId()).messages({
            "array.base": "likingAnswers 必须为数组",
            "string.pattern.name": "数组中必须传入 objectId 类型"
        }),
    })
    return schema.validate(data)
}
```



* controller---->user.js

```js
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
```



* routes---->user.js

```js
//收藏
router.put("/collectingAnswer/:id", [auth, checkAnswerExist], user.collectingAnswer)

//取消收藏
router.delete("/collectingAnswer/:id", [auth, checkAnswerExist], user.uncollectingAnswer)

//收藏过的列表
router.get("/:id/collectingAnswer", user.listCollectingAnswers)
```



### 11.评论模块

#### 11.1 需求分析（三级嵌套

* 评论的增删改查
* 答案-评论/问题-评论/用户-评论（一对多）
* 一级评论与二级评论
* 日期

#### 11.2 评论数据结构以及校验

* model---->comments.js

```js
//评论的数据结构

//引入数据库
const mongoose = require("mongoose")

//引入joi
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

//定义 comments 结构
const commentSchema = new mongoose.Schema({
    //隐藏版本信息 ：__v
    __v: {
        type: Number,
        select: false
    },
    //评论内容
    content: {
        type: String,
        required: true
    },
    //评论人
    commentator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    //问题的ID
    questionId: {
        type: String
    },
    //回答的Id
    answerId: {
        type: String
    }
})

//创建 Model
const Comment = mongoose.model("Comment", commentSchema)
//评论数据 校验规则
function commentValidator(data) {
    const schema = Joi.object({
        content: Joi.string().required(),
        commentator: Joi.objectId,
        questionId: Joi.string(),
        answerId: Joi.string()
    })
    return schema.validate(data)
}

//导出
module.exports = {
    //导出model
    Comment,
    //导出用户校验规则
    commentValidator
}
```



#### 11.3 再来2个中间件

* middleware---->checkCommentator.js

```js
//导入评论模块
const { Comment } = require("../model/comments")

// 检测评论人 中间件
module.exports = async (req, res, next) => {
    const comment = await Comment.findById(req.params.id).select("+commentator");
    if (comment.commentator.toString() !== req.userData._id) {   //通过 Id 比较回答问题的人与登陆的人是否为同一个人
        return res.status(400).json({
            code: 400,
            msg: "没有权限！"
        })
    }
    next();
}
```



* middleware---->checkCommentExist.js

```js
//导入评论模块
const { Comment } = require("../model/comments")

// 检测评论是否存在 中间件
module.exports = async (req, res, next) => {
    const comments = await Comment.findById(req.params.id).select("+commentator");
    if (!comments) return res.status(404).json({
        code: 404,
        msg: "该评论不存在！"
    })
    //判断评论下有没有答案
    if (req.params.questionId && comments.questionId !== req.params.questionId) {
        return res.status(400).json({
            code: 404,
            msg: "该问题下没有评论！"
        })
    }
    //答案模块
    if (req.params.answerId && comments.answerId !== req.params.answerId) {
        return res.status(400).json({
            code: 404,
            msg: "该答案下没有评论！"
        })
    }
    next();
}
```



#### 11.4 增删改查

* controller---->comments.js

```js
//评论的增删改查

//导入评论模型（数据结构）
const { Comment } = require("../model/comments")

//获取评论列表
exports.getCommentsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const { questionId, answerId } = req.params  // = req.params.questionId,req.params.answerId
        const commentsList = await Comment.find({ content: keyword, questionId, answerId }).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!commentsList) return res.status(400).json({
            code: 400,
            msg: "获取评论列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论列表成功！",
            data: commentsList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定评论
exports.getComment = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join(" ")
        const comment = await Comment.findById(req.params.id).select(selectFields).populate("commentator")
        if (!comment) return res.status(400).json({
            code: 400,
            msg: "获取评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论成功",
            data: comment
        })
    } catch (err) {
        next(err)
    }
}

//新增评论
exports.createComment = async (req, res, next) => {
    try {
        const { questionId, answerId } = req.params
        //直接创建评论，因为多个人可以作出同一个评论
        const comment = new Comment({ ...req.body, answerer: req.userData._id, questionId, answerId })  //在里面传入参数：req.body(作出的评论)、questionId(提出问题人的ID)、answerer：回答问题的人
        await comment.save()
        res.status(200).json({
            code: 200,
            msg: "评论创建成功！",
            data: comment
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改评论
exports.updateComment = async (req, res, next) => {
    try {
        let commentId = req.params.id
        const data = await Comment.findByIdAndUpdate(commentId, req.body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新评论失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新评论成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除评论
exports.deleteComment = async (req, res, next) => {
    try {
        const data = await Comment.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除评论成功！",
            data: data
        })
    } catch (err) {
        next(err)
    }
}
```



* routes---->comments.js

```js
const router = require("express").Router()
//引入鉴权中间件
const auth = require("../middleware/auth")
//导入两个封装的校验中间件
const checkCommentExist = require("../middleware/checkCommentExist")
const checkCommentator = require("../middleware/checkCommentator")
//导入评论数据校验函数
const { commentValidator } = require("../model/comments")
//导入校验中间件
const validator = require("../middleware/validate")
//控制器
const comment = require("../controller/comments")

//获取评论列表 配置
router.get("/", comment.getCommentsList)

//获取指定评论 配置
router.get("/:id", comment.getComment)

//创建/新增评论
router.post("/", [auth, validator(commentValidator)], comment.createComment)

//更新/修改评论
router.patch("/:id", [auth, validator(commentValidator), checkCommentExist, checkCommentator], comment.updateComment)

//删除评论
router.delete("/:id", [auth, checkCommentExist, checkCommentator], comment.deleteComment)

//最后将其导出
module.exports = router
```



* routes---->index.js

```js
//评论模块接口   (三级嵌套路由： 问题--->答案--->评论)
router.use("/questions/:questionId/answers/:answerId/comments",require("./comments"))
```



#### 11.5一级与二级评论

* model---->comments.js       **增加代码**

```js
//定义 comments 结构
const commentSchema = new mongoose.Schema({
    
    //二级评论回复哪个评论，指向一级评论的ID
    rootCommentId: {
        type: String
    },
    //二级评论回复谁(指向一级评论人的ID)
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

//创建 Model
const Comment = mongoose.model("Comment", commentSchema)
//评论数据 校验规则
function commentValidator(data) {
    const schema = Joi.object({
        rootCommentId: Joi.string(),
        replyTo: Joi.objectId()
    })
    return schema.validate(data)
}
```



* controller---->comments.js       

```js
//评论的增删改查

//导入评论模型（数据结构）
const { Comment } = require("../model/comments")

//获取评论列表
exports.getCommentsList = async (req, res, next) => {
    try {
        //分页功能
        //获取当前是第几页
        const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
        //每页有几条数据
        const { per_page = 10 } = req.query   //每页几条数据默认给一个值
        const perPage = Math.max(per_page * 1, 1);    //per_page：是用户输入的
        const keyword = new RegExp(req.query.keyword);
        const { questionId, answerId } = req.params  // = req.params.questionId,req.params.answerId
        const { rootCommentId } = req.query
        const commentsList = await Comment.find({ content: keyword, questionId, answerId, rootCommentId }).limit(perPage).skip(page * perPage).populate("commentator replyTo")   //limit：每页显示几条数据，skip：跳过几条数据。   $or:模糊搜索在'问题'和'描述'中进行检索
        if (!commentsList) return res.status(400).json({
            code: 400,
            msg: "获取评论列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论列表成功！",
            data: commentsList
        })
    } catch (err) {
        next(err)
    }
}

//获取指定评论
exports.getComment = async (req, res, next) => {
    try {
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join(" ")
        const comment = await Comment.findById(req.params.id).select(selectFields).populate("commentator")
        if (!comment) return res.status(400).json({
            code: 400,
            msg: "获取评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论成功",
            data: comment
        })
    } catch (err) {
        next(err)
    }
}

//新增评论
exports.createComment = async (req, res, next) => {
    try {
        const { questionId, answerId } = req.params
        const commentator = req.userData._id
        //直接创建评论，因为多个人可以作出同一个评论
        const comment = new Comment({ ...req.body, answerer: req.userData._id, questionId, answerId, commentator })  //在里面传入参数：req.body(作出的评论)、questionId(提出问题人的ID)、answerer：回答问题的人
        await comment.save()
        res.status(200).json({
            code: 200,
            msg: "评论创建成功！",
            data: comment
        })
    } catch (err) {
        next(err)
    }
}

//更新/修改评论
exports.updateComment = async (req, res, next) => {
    try {
        let commentId = req.params.id
        const { content } = req.body
        const data = await Comment.findByIdAndUpdate(commentId, content)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新评论失败！",
            value: data
        })
        res.status(200).json({
            code: 200,
            msg: "更新评论成功！",
            data: req.body
        })
    } catch (err) {
        next(err)
    }
}

//删除评论
exports.deleteComment = async (req, res, next) => {
    try {
        const data = await Comment.findByIdAndDelete(req.params.id)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除评论成功！",
            data: data
        })
    } catch (err) {
        next(err)
    }
}
```



![image-20230115224157674](../../../../vue3 同步学习/笔记/image-20230115224157674.png)



#### 11.6 添加时间

* 在 model 数据结构中添加 ；   ***时间显示的时区不对，待优化***

```js
//增加时间显示
{timestamps: true}
```



### 12. 文章分类与文章模块

#### 12.1 需求分析

* 文章分类
* 文章模块

#### 12.2 分类模块具体实现

##### 12.2.1 数据结构及校验

* model----->categories.js

```js
const mongoose = require("mongoose")

const Joi = require("joi")

//定义分类category的结构,结构表categorySchema
const categorySchema = new mongoose.Schema({
    _v: {
        type: Number,
        select: false
    },
    //分类名称
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
})

//定义分类category的校验规则
function categoryValidator(data) {
    const schema = Joi.object({
        name: Joi.string().max(20).min(2).required().messages({
            "string.base": "name 必须为 string 类型",
            "string.min": "name 最少2个字符",
            "string.max": "name 最多20个字符",
            "any.required": "缺少必选参数 name"
        })
    })
    return schema.validate(data)
}

//创建模型model
const Category = mongoose.model("Category", categorySchema)

//导出
module.exports = {
    Category,
    categorySchema
}
```



##### 12.2.2 分类的增删改查

* controller----->categories.js

```js
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
```



* routes---->categories.js

```js
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
```



* routes---->index.js

```js
//分类模块接口
router.use("/categories",require("./categories"))
```



#### 12.3 文章分类具体实现

##### 12.3.1 数据结构及校验

* model---->articles.js

```js
//文章数据结构

const mongoose = require("mongoose")

const Joi = require("joi")

//引入 Joi-objectid 并设置为 Joi 的属性
Joi.objectId = require("joi-objectid")(Joi)

//定义文章 article 的结构,结构表articleSchema
const articleSchema = new mongoose.Schema({
    _v: {
        type: Number,
        select: false
    },
    //文章标题
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    //文章内容
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200
    },
    //文章状态设置：发布/草稿
    status: {
        type: String
    },
    //创建时间
    createAt: {
        type: Date,
        default: Date.now
    },
    //更新时间
    updateAt: {
        type: Date,
        default: Date.now
    },
    //文章分类
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    //作者
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    //时间戳
    { timestamps: true }
)

//创建模型model
const Article = mongoose.model("Article", articleSchema)

//定义文章 article 的校验规则
function articleValidator(data) {
    const schema = Joi.object({
        title: Joi.string().max(50).min(2).required().messages({
            "string.base": "title 必须为 string 类型",
            "string.min": "title 最少2个字符",
            "string.max": "title 最多50个字符",
            "any.required": "缺少必选参数 title"
        }),
        content: Joi.string().min(2).max(200).required().messages({
            "string.base": "content 必须为 string 类型",
            "string.min": "content 最少2个字符",
            "string.max": "content 最多200个字符",
            "any.required": "缺少必选参数 content"
        }),
        status: Joi.string().valid("published", "drafted", "trashed").required().messages({
            "string.base": "status 必须为 string 类型",
            "any.required": "缺少必选参数 content",
            "any.only": "valid 取值有误，可选值为 published|drafted|trashed"
        }),
        category: Joi.objectId().required().messages({
            "string.pattern.name": "category 格式有误，应为 ObjectId 格式",
            "any.required": "category 必须设置"
        })
    })
    return schema.validate(data)
}

//导出
module.exports = {
    Article,
    articleValidator
}
```



##### 12.3.2 文章的增删改查

* controller---->articles.js

```js
//引入文章model
const { Article } = require("../model/articles")

//获取文章列表
exports.getArticlesList = async (req, res, next) => {
    //不加分页功能
    try {
        //检测是否存在 分类|状态  筛选条件
        const { status, category } = req.query
        let data
        //如果有文章状态，就通过文章状态查询
        if (status || category) {
            data = await Article.find(req.query)
        } else {   // 如果没有文章状态，就整体查询
            data = await Article.find()
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

    //加分页功能
    // try {
    //     //分页功能
    //     //获取当前是第几页
    //     const page = Math.max(req.query.page * 1, 1) - 1;  //乘 1 ，使query取到的字符串类型值 转变为 数字类型 值;Math.max :如果输入的值小于1，则赋值 1 。
    //     //每页有几条数据
    //     const { per_page = 10 } = req.query   //每页几条数据默认给一个值
    //     const perPage = Math.max(per_page * 1, 1);  //per_page：是用户输入的
    //     //文章获取
    //     //检测是否存在 分类|状态  筛选条件
    //     const { status, category } = req.query
    //     let data
    //     //如果有文章状态，就通过文章状态查询
    //     if( status || category ) {
    //         data = await Article.find(req.query).limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。
    //     }else {   // 如果没有文章状态，就整体查询
    //         data = await Article.find().limit(perPage).skip(page * perPage)   //limit：每页显示几条数据，skip：跳过几条数据。
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
```



* routes---->articles.js

```js
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
```



* routes---->index.js

```js
//文章模块接口
router.use("/articles", require("./articles"))
```



### 13. 温故而知新

* 功能模块（用户->登陆->上传文件->个人资料->关注与粉丝->话题->问题->答案->评论->文章与分类）

* 可以优化的点

  * 加时间戳{ timestamps: true }；

  * ***更新时***修改返回数据（new:true），具体见controller---->articles.js里的更新文章；
  * 创建时传入创建者本人id（如：new Article(Object.assign(req.body, { author: req.userData._id }))）
  * 修改、删除用户信息时，只有登陆了A才能删除A，否则删除失败；***let userId = req.userData._id***

* 可以扩展的点（文章模块可以进行优化扩展：文章也能与某***话题***关联；也可以添加中间件来判断文章是否存在和是否为本人写的；对文章也可以进行赞、踩）

