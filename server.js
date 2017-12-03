var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');// 解析body字段模块
var ejs = require('ejs');
var ejs_mate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');//加载解析cookie的中间件
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session); //connect-mongo
var passport = require('passport');// 用户认证模块passport

var secret = require('./config/secret');
var User = require('./models/user');

var app = express();
//'mongodb://root:123456@ds161209.mlab.com:61209/ecommerces'
mongoose.connect(secret.datebase,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("连接数据库成功！");
    }
});

//Middleware
app.use(express.static(__dirname + '/public'));//通过Express内置的express.static可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
app.use(morgan('dev'));// 命令行中显示程序运行日志,便于bug调试
app.use(bodyParser.json());// 调用bodyParser模块以便程序正确解析body传入值
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,// 即使 session 没有被修改，也保存 session 值，默认为 true。
    saveUninitialized: true,//强制没有“初始化”的session保存到storage中
    secret: secret.secretKey,//通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。"Bob@$@!#@"
    store: new MongoStore({
        url: secret.datebase,
        autoReconnect: true
    }) //autoReconnect 当数据库连接异常中断时，是否自动重新连接
}));
app.use(flash());
app.use(passport.initialize());// 初始化passport模块
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
});

app.engine('ejs',ejs_mate);
app.set('view engine','ejs');

/* 迁移至routes/user.js
app.post('/create-user',function(req,res,next){
    var user = new User();

    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    user.save(function(err){
        if(err) return next(err);
        res.json('成功新建一个用户！');
    });
});
*/

/*route移除后新增*/
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

/* 迁移至routes/main.js
app.get('/',function(req,res){
    res.render('main/home');
});

app.get('/about',function(req,res){
    res.render('main/about');
});
*/

//端口3000
app.listen(secret.port,function(err){
    if(err) throw err;
    console.log("Server is Running on port " + secret.port);
});

/*
app.get('/',function(req,res){
    var name = "Jack";
    res.json("My name is " + name);
});

*/