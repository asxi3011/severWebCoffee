const User = require('../model/user');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const privateKey = 'doAnChuyenNganh123';
class managerControllers{
   
    login(req,res){
        res.render('clientPage/managerLogin',{layout:"none"})
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
                            res.cookie('Token',Token);
                            res.redirect('/me/category');
                        }
                    })
                    //es.redirect('/me/dashboard')
                }else{
                    res.render('clientPage/managerLogin',{layout:"none",msg:"Sai mật khẩu"});
                }
            });
        })
        .catch(()=>{
            res.render('clientPage/managerLogin',{layout:"none",msg:"Sai thông tin tài khoản"});
        })
    }
   
}

module.exports = new managerControllers;