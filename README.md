# 【第一章】
## 001 项目介绍
>`仿亚马逊构建电商网站`

## 002 项目需求
>`添加商品、搜索、购物车、登录注册、支付`

## 003 相关网站
`https://nodejs.org/en/`

`http://www.expressjs.com.cn/`

`http://www.embeddedjs.com/`

`https://www.mongodb.com/`

`https://www.elastic.co/cn/`

`http://jquery.com/`

`https://stripe.com/`

## 004 开发工具
>`1.node 2.VS code(Atom) 3.mLab 4.Git 5.github`

## 005 git、github使用教程
```javascript
echo "# ecommerce" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/wp360/ecommerce.git
git push -u origin master
```
[Git使用官方文档](https://git-scm.com/book/zh/v2)

## 006 HTTP基础教程
>`1.GET 2.POST 3.PUT 4.DELETE`
```javascript
GET    = Retrieve data from the server
POST   = sending data to the server
PUT    = updating data from the server
DELETE = delete data from the server
```
>`Conclusion 总结`
```javascript
URL                  => Node.js + express
Batabase Operation   => Mongodb + Mongoose
Frontend code        => HTML/CSS/Jquery
```
# 【第二章】
## 001 新建项目，启动服务
>`1.新建文件夹ecommerce 2.npm init 3.server.js（express）`
```js
var express = require('express');
var app = express();
app.listen(3000,function(err){
    if(err) throw err;
    console.log('服务启动，端口3000');
});
```
`npm install express --save`
`nodemon server`
[nodemon 基本配置与使用](http://www.cnblogs.com/JuFoFu/p/5140302.html)

## 002 路由
```js
app.get('/',function(req,res){
    var name = 'Bob';
    res.json('My name is' + name);
    //res.json([body]) 发送一个json的响应
    //这个方法和将一个对象或者一个数组作为参数传递给res.send()方法的效果相同
});
```
[官方文档](http://www.expressjs.com.cn/guide/routing.html)

## 003 【morgan 日志篇】
`npm install morgan --save`
### Node 进阶：express 默认日志组件 morgan 从入门使用到源码剖析
[express 默认日志组件 morgan](http://www.cnblogs.com/chyingp/p/node-learning-guide-express-morgan.html)

### Morgan预定义输出格式
[链接](https://yq.aliyun.com/articles/2983)

## 004 【bcrypt 加密篇】
`npm install bcrypt-nodejs --save`
### nodejs中的bcryptjs密码加密
[链接](https://segmentfault.com/a/1190000008841988)
```js
nodejs 密码加盐 >>>
var bcrypt = require('bcrypt-nodejs')  
var SALT_WORK_FACTOR = 10;

//  数据库中保存hash密码 以及对应的加密salt
bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt){ 
    if (err) {
        return next(err)
    }
    console.log('salt:'+ salt)
    bcrypt.hash('hangaoke',salt ,null,function(err,hash){
      if(err) return next(err)
        console.log('hash:'+hash)
    })
})
```
### bcrypt加密密码计算强度代表什么意思
[链接](https://segmentfault.com/q/1010000002787622)

## 005 【mongoose 数据篇】
`npm install mongoose --save`
> Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具
[Mongoose学习参考文档](https://cnodejs.org/topic/504b4924e2b84515770103dd)
1. Schema  ：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力

2. Model   ：  由Schema发布生成的模型，具有抽象属性和行为的数据库操作对

3. Entity  ：  由Model创建的实体，他的操作也会影响数据库
> Schema、Model、Entity的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
```js
server.js >>>
var mongoose = require('mongoose');
// secret.datebase mongodb数据库地址
mongoose.connect(secret.datebase,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("连接数据库成功！");
    }
});
```
### 官网文档（英文）
[链接](http://www.nodeclass.com/api/mongoose.html)

### Mongo基础使用，以及在Express项目中使用Mongoose
[链接](http://www.cnblogs.com/winyh/p/6682032.html)

### Mongoose简要API
[参考链接](http://www.cnblogs.com/winyh/p/6682039.html)

[相关链接](http://www.cnblogs.com/stoneniqiu/p/5556669.html)
```js
user.js >>>
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/*schema可以理解为mongoose对表结构的定义

(不仅仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等)，

每个schema会映射到mongodb中的一个collection，schema不具备操作数据库的能力

定义Schema

//语法
new mongoose.Schema({字段...}, [options])
*/
var UserSchema = new Schema({
    email: {type: String,unique: true,lowercase: true},
    password: String,
    // 简要概述
    profile: {
        name: {type: String,default: ''},
        picture: {type: String,default: ''}
    },
    address: String,
    history: [{
        date: Date,
        paid: {type: Number,default: 0},
        //item: {type: Schema.Types.ObjectId,ref: ''}
    }]
})

/*
var user = new User();
user.email = '';
user.profile.name = 'Bob';
*/

/*在保存数据前需要对密码先进行加密 hash*/
UserSchma.pre('save',function(next){
    var user= this;
    if(!user.isModified('password')) return next();
    bcrypt.getSalt(10,function(err,salt){
        if (err) return next(err);
        bcrypt.hash(user.password,salt,null,function(err,hash){
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
/*密码比对验证*/
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
// 利用UserSchema实例,发布一个User的model并且导出
module.exports = mongoose.model('User', UserSchema);
// 关于Mongoose的使用，还可以参考： http://www.jianshu.com/p/f22ee9735249
```
## express的中间件bodyParser详解
> bodyParser用于解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理。
```js
var bodyParser = require('body-parser');
//...省略
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
```
## ejs与ejs-mate 模板引擎
```js
var ejs = require('ejs');
var ejs_mate = require('ejs-mate');
//...省略
app.engine('ejs',ejs_mate);
app.set('view engine','ejs');
//...省略
app.get('/',function(req,res){
    res.render('home');//模板home.ejs渲染生成
});
```
### EJS常用标签
* <% %>流程控制标签
* <%= %>输出标签（原文输出HTML标签）
* <%- %>输出标签（HTML会被浏览器解析）
* <%# %>注释标签
* % 对标记进行转义
* -%>去掉没用的空格
* <%- include filename %> 加载其他页面模版
> 说明：ejs中的逻辑代码全部用JavaScript
[ejs模板的书写](http://www.jianshu.com/p/67dda091fc68)

## 登录与验证
* Session 能够标记客户端在服务器上的状态。利用这一点，我们能够实现客户端的登录验证。
* Session 登录验证的流程大致为：客户端若在未登录的状态下请求主页，那么服务器将该请求重定向到登录页面；客户端在登录后，服务器需要记录保存该客户端的登录状态，并给予一个活动期限，这样下一次服务器请求主页的时候，就能够判断该客户端的登录状态，若登录状态有效，直接返回客户端需要的页面，否则重定向到登录页面。

## Authenticate验证
```js
app.post('/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}),
function(req, res) {
    // 验证成功则调用此回调函数
    res.redirect('/users/' + req.user.username);
});
//这里的passport.authenticate(‘local’)就是中间件，若通过就进入后面的回调函数，并且给res加上res.user，若不通过则默认返回401错误。
```
> authenticate()方法有3个参数，第一是name，即验证策略的名称，第二个是options，包括下列属性：
* session：Boolean。设置是否需要session，默认为true
* successRedirect：String。设置当验证成功时的跳转链接
* failureRedirect：String。设置当验证失败时的跳转链接
* failureFlash：Boolean or String。设置为Boolean时，express-flash将调用use()里设置的message。设置为String时将直接调用这里的信息。
* successFlash：Boolean or String。使用方法同上。

### 验证多个条件
> 在配置策略的时候，Strategy接受一个options参数，它包含一个passReqToCallback项，默认为false，设置为true时可以将整个req传递给回调函数，这样在回调里就可以验证req中带的所有条件了。

[Express + Session 实现登录验证](http://www.cnblogs.com/mingjiatang/p/7495321.html)

## connect-mongo模块
> session数据存储空间一般是在内存中开辟的，那么在内存中的session显然是存在极大的数据丢失的隐患的，比如系统掉电，所有的会话数据就会丢失，如果是证券交易所那么这种后果的严重性可想而知。所以为了解决这个问题可以将session持久化保存，比如保存到数据库。那么这篇博客就是介绍session持久化保存到mongoDB的工具connect-mongo。

## 【存疑】
1. 不用ejs2 是因为 ejs-mate只支持ejs1？
2. req.flash的介绍：通过它保存的变量生命周期是用户当前和下一次请求，之后会被清除。
新版本的express取消了req.flash,建议直接使用req.session，但貌似在ejs中无法直接操作session的。

# 【第三章】
## 商品分类
### 开发步骤
1. 新增商品（models/product.js）及分类模型（models/category.js）
2. 路由生成（routes/admin.js）
3. 服务对接（server.js）
```js
var adminRoutes = require('./routes/admin');
...省略
app.use(adminRoutes);
```
4. 模板内容（partials/navbar.ejs）
```html
    <!-- 商品分类 -->
    <li>
        <a class="dropdown-toggle" data-toggle="dropdown" href="#">商品分类</a>
        <ul class="dropdown-menu">
            <% for(var i=0;i<categories.length;i++) { %>
                <li><a><%= castegories[i].name %></a></li>
            <% } %>
        </ul>
    </li>
```
5. 用户路由（routes/main.js）
```js
var User = require('../models/user');
...省略
router.get('/users', function (req, res) {
    userInfo.find({},function(err,user){
        res.json(users);
    });
});
```
## asyncjs，waterfall的使用
> waterfall(tasks, [callback]) （多个函数依次执行，且前一个的输出为后一个的输入）
> 按顺序依次执行多个函数。每一个函数产生的值，都将传给下一个函数。如果中途出错，后面的函数将不会被执行。错误信息以及之前产生的结果，将传给waterfall最终的callback。
注：现在大多已经用promise和generator语法了
## Faker API
`npm install faker async --save`

新建api文件夹，生成api.js，server.js加载处理请求的路由模块。
```js
var apiRoutes = require('./api/api');
//...省略
app.use('/api',apiRoutes);
//注：app.use 不是来处理请求的, 而是来加载处理请求的路由模块的参数。
```

## Mongoosastic
```js
var mongoose     = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema       = mongoose.Schema

var User = new Schema({
    name: String
  , email: String
  , city: String
})

User.plugin(mongoosastic)
```
[Mongoosastic说明文档](https://github.com/mongoosastic/mongoosastic/)
[Elasticsearch: 权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)

## 备注：
[参考源码](https://github.com/nattafahhm/node_e-commerce)
[nodeJS---express4+passport实现用户注册登录验证](http://www.cnblogs.com/y-yxh/p/5859937.html)
[Node.js+MongoDB对于RestfulApi中用户token认证的实践](https://cnodejs.org/topic/58c1477b06dbd608756d0bca)

## 其他
http://www.embeddedjs.com/

http://www.jianshu.com/p/67dda091fc68

https://www.elastic.co/products/elasticsearch

http://www.jianshu.com/p/05cff717563c

https://elasticsearch.cn/

https://stripe.com/blog/hong-kong

## [MLab]
[云数据库](https://mlab.com)
```javascript
操作步骤：
第一步，注册登陆；
第二步，Create new；
第三步，选择亚马逊，sandBox，免费Free；
第四步，填写数据库名称；
第五步，确定完成；
第六步，点击用户 > Add database user > 会生成弹框 > 直接输入保存即可；
第七步，相关页面数据对接
secret.datebase = 'mongodb://root:123456@ds161209.mlab.com:61209/ecommerces';
备注：界面好像有更新 不过操作依旧简便。
```

## 补充
[module.exports与exports，export与export default之间的关系和区别](http://www.cnblogs.com/fayin/p/6831071.html)
