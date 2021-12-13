const User = require('../model/user');
const Tokenn = require('../model/Token');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Token = require('../model/Token');
const saltRounds = 10;
const privateKey = 'doAnChuyenNganh123';
class managerControllers{
   
    login(req,res){
        res.render('clientPage/managerLogin')
    }
    authenticationAccount(req,res){
        const myPlaintextPassword = req.body.password;
        User.findOne({user:req.body.user})
        .lean()
        .then(data=>{
            var hashPass = data.password;
            bcrypt.compare(myPlaintextPassword, hashPass, function(err, result) {
                if(result == true){
                  
                    jwt.sign({
                        idUser:data._id,
                        user:data.user,
                        hoten:data.hoten,
                        role:data.role,
                    },privateKey,{expiresIn:Math.floor(Date.now() / 1000) + (60 * 60)},function (err,Token) {  // expiresIn 1 tiếng
                        if(err){
                            res.json('Tao token that bai');
                        }
                        else{
                          
                      
                            var currenToken = new Tokenn({
                                Token:Token,
                                UserId:data._id,
                                RegisterDate:Date.now(),
                                State:true,
                            })
                            currenToken.save(function (err) {
                                if(err){
                                    res.json('Save Token that bai'+err);
                                }else{
                                    res.cookie('Token',Token);
                                    res.redirect('/me/category');
                                }
                            })
                  
                        }
                    })
                    //es.redirect('/me/dashboard')
                }else{
                    res.json('sai mat khau');
                }
            });
        })
       
      
    }

    verifyToken(req,res){
        Token.findOne({Token:req.body.Token,State:true})
        .lean()
        .then(result=>{
            if(!result){
                res.json('Token khong hợp lệ');
                return;
            }
            jwt.verify(req.body.Token,privateKey,function (err,decode) {
                res.json({user:decoded})
            })
        })
    }

}

module.exports = new managerControllers;