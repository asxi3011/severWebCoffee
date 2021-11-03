const Tokenn = require('../../app/model/Token');
const privateKey = 'doAnChuyenNganh123';
var jwt = require('jsonwebtoken');

module.exports.postCreate =function (req,res,next) {
    if(!req.cookies.Token){
        res.redirect('/manager/login')
    }
     Tokenn.findOne({Token:req.cookies.Token})
     .lean()
     .then(data=>{
         if(!data){
            res.redirect('/manager/login');
            return;
         }
        res.locals.token = data;
        next();
     })
   
}


module.exports.getUser =function (req,res,next) {
    var Token =res.locals.token.Token;
    Tokenn.findOne({Token:Token,State:true})
    .lean()
    .then(result=>{
        
        if(result != null){
            jwt.verify(Token,privateKey,function (err,decode) {
                res.locals.user = decode;
                next();
            })
        }
        else{
            res.json('Token khong hợp lệ');
            return;
        }   
      
    })
    
   
}

module.exports.roleAdmin =function (req,res,next) {
    console.log(res.locals.user.role);
    next();
   
}