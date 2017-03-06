var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejs_mate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session); //connect-mongo/es5
var passport = require('passport');

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
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,// 即使 session 没有被修改，也保存 session 值，默认为 true。
    saveUninitialized: true,//强制没有“初始化”的session保存到storage中
    secret: secret.secretKey,//通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。"Bob@$@!#@"
    store: new MongoStore({url:secret.datebase,autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());//
app.use(passport.session());//
//Fixing some codes Part1 8.08'
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

