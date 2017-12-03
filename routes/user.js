var router = require('express').Router();
var User = require('../models/user');
var passport =require('passport');
var passportConf = require('../config/passport');

router.get('/login',function(req,res){
    if(req.user) return res.redirect('/');
    res.render('accounts/login',{message: req.flash('loginMessage')});
});

router.post('/login',passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile',function(req,res,next){
    //res.json(req.user);
    User.findOne({_id:req.user._id},function(err,user){
        if(err) return next(err);
        res.render('accounts/profile',{user:user});
    });
});

router.get('/signup',function(req,res,next){
    res.render('accounts/signup',{
        errors: req.flash('errors')
    });//res.render()就是将我们的数据填充到模板后展示出完整的页面。
});

router.post('/signup',function(req,res,next){
    var user = new User();

    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profile.picture = user.gravatar();
    //findOne 用来通过条件查询单条文档
    //Model.findOne(conditions, [fields], [options], [callback])
    User.findOne({ email: req.body.email },function(err,existingUser){
        if(existingUser){
            //console.log(req.body.email + "已经存在");
            req.flash('errors','注册的邮箱地址已经存在！');//Account with that email address already exists!
            return res.redirect('/signup');
        }else{
            user.save(function(err,user){
                if(err) return next(err);
                //res.json('成功新建一个用户！');
                //return res.redirect('/');重定向一个post请求
                req.logIn(user,function(err){
                    if(err) return next(err);
                    res.redirect('/profile');
                });
            });
        }
    });
});

//Fixing some codes Part1 退出登录
router.get('/logout',function(req,res,next){
    req.logout();
    res.redirect('/');
});
//编辑个人信息
router.get('/edit-profile',function(req,res,next){
    res.render('accounts/edit-profile',{message: req.flash('success')});
});

router.post('/edit-profile', function (req, res, next) {
    User.findOne({ _id: req.user._id},function(err,user){
        if(err) return next(err);
        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.address) user.address = req.body.address;
        user.save(function(err){
            if(err) return next(err);
            req.flash('success','已经成功编辑你的个人信息');
            return res.redirect('/edit-profile');
        });
    });
});

module.exports = router;

//说明：创建了一个Router实例，然后调用router.post为“/signup”路径应用了路由函数。最后使用module.exports将Router对象导出。