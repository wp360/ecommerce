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
});
```
[官方文档](http://www.expressjs.com.cn/guide/routing.html)

## 003 【morgan 日志篇】
### Node 进阶：express 默认日志组件 morgan 从入门使用到源码剖析
[express 默认日志组件 morgan](http://www.cnblogs.com/chyingp/p/node-learning-guide-express-morgan.html)
`npm install morgan --save`

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
[链接](http://www.cnblogs.com/winyh/p/6682039.html)
[链接](http://www.cnblogs.com/stoneniqiu/p/5556669.html)
```js
user.js >>>
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/*schema可以理解为mongoose对表结构的定义(不仅仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等)，每个schema会映射到mongodb中的一个collection，schema不具备操作数据库的能力

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

## 备注：
[参考](https://github.com/nattafahhm/node_e-commerce)
### nodeJS---express4+passport实现用户注册登录验证
[链接](http://www.cnblogs.com/y-yxh/p/5859937.html)

## 其他
http://www.embeddedjs.com/

http://www.jianshu.com/p/67dda091fc68

https://www.elastic.co/products/elasticsearch

http://www.jianshu.com/p/05cff717563c

https://elasticsearch.cn/

https://stripe.com/blog/hong-kong
