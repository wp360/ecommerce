var mongoose = require('mongoose');
// 引入bcrypt模块
var bcrypt = require('bcrypt-nodejs');
// 定义加密密码计算强度 
var SALT_WORK_FACTOR = 10;
// 定义用户模式
var Schema = mongoose.Schema;

/*The user schema attributes*/ 
var UserSchema = new Schema({
    email:{type:String,unquire:true,lowercase:true},
    password: String,

    profile:{
        name:{type:String,default:''},
        picture:{type:String,default:''}
    },

    address:String,
    history:[{
        date:Date,
        paid:{type:Number,default:0},
    }]
});

/*使用pre中间件在用户信息存储前进行密码加密*/
UserSchema.pre('save',function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    // 进行加密（加盐）
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/*对比数据库内的密码*/
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',UserSchema);

