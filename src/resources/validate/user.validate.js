
const privateKey = 'doAnChuyenNganh123';
var jwt = require('jsonwebtoken');

module.exports.postCreate =function (req,res,next) {
    if(!req.cookies.Token){
        res.redirect('/manager/login')
    }else{
        var Token =req.cookies.Token;
        jwt.verify(Token,privateKey,function (err,decode) {
            res.locals.user = decode;
            next();
        })
    }
}

module.exports.roleAdmin =function (req,res,next) {
    console.log(res.locals.user.role);
    next();
   
}