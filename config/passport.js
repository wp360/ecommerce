var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;//本地认证策略
var User = require('../models/user');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Middleware
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ email: email}, function(err, user) {
    if (err) return done(err);
    if (!user) {
      return done(null, false, req.flash('loginMessage', '用户名不存在'));
    }
    if (!user.comparePassword(password)) {
      return done(null, false, req.flash('loginMessage', '密码错误'));
    }
    return done(null, user);
  });
}));

//custom function to validate 将req.isAuthenticated()封装成中间件导出
//isAuthenticated()：不带参数。作用是测试该用户是否存在于session中（即是否已登录）。
//若存在返回true。事实上这个比登录验证要用的更多，毕竟session通常会保留一段时间，在此期间判断用户是否已登录用这个方法就行了。
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
