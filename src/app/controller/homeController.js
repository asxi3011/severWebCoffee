const Order = require('../model/order')
const Product = require('../model/product');
const Category = require('../model/category');
const Post = require("../model/post");
const nodemailer =  require("nodemailer");
class homeControllers{
    bestseller12(req,res){
        var bestseller = "bestseller";
       
        Product.find({status:bestseller}).lean().limit(12)
        .then(data=>{
            res.json({status:"success",dataBestseller:data,});
        })
        .catch((err)=>{
            res.json({status:"fail",err:err});
        })
    }
    post8(req,res){
        Post.find().lean().limit(8)
        .then(dataPost=>{
            res.json({status:"success",dataPost:dataPost});
        })
        .catch(err=>{
            res.json({status:"fail",err:err});
        })
    }
    detailProduct(req,res){
        var slug = req.params.slug;
        Product.findOne({slug:slug}).lean()
        .then(data=>{
               
                res.json({status:"success",product:data})
        })
        .catch((err)=>{
            res.json({status:"fail",err:err})
        })
            
    }
    getProductsInCategory(req,res){
       var slug = req.params.slug;
       Category.findOne({slug:slug}).lean().then(data=>{
            Product.find({$and:[
                {idCategory:data._id},
                {status:{$in:["ready","bestseller"]}}
            ]}).lean()
            .then(dataProduct=>{
                res.json({status:"success",dataProducts:dataProduct});
            })
            .catch((err)=>{
                res.json({status:"fail",err:err})
            })
       })
       .catch((err)=>{
        res.json({status:"fail",err:err})
        })
    }
    getProduct(req,res,next){
        var idProduct=req.query.id;
        Product.findById({_id:idProduct}).lean()
        .then(data=>{
            res.json(data);
        })
     }
    storeOrder(req,res){
        var idDonHang =  Date.now()+makeid(4);
        Order.find({idOrder:idDonHang})
        .lean()
       .then(data=>{
           if(data.length >0){
                res.send('đã có mã này rồi,vui lòng thử lại');
           }else{
                var addressOrder=req.body.addressOrder;
                var noteOrder= req.body.noteOrder;
                var hotenOrder = req.body.hotenOrder;
                var sdtOrder = req.body.sdtOrder;
                var payment = req.body.payment;
                var priceTotal = req.body.priceTotal;
                var listProduct = req.body.listProductOrder;
                var priceCharge = req.body.priceCharge;
                var priceCoupon = req.body.priceCoupon;
                var nameCoupon = req.body.nameCoupon;
                var statusOrder = req.body.statusOrder;
                var emailOrder = req.body.emailOrder;
                const newOrder = new Order({
                    idOrder:idDonHang,
                // priceStandard:{type:Number},
                    noteOrder,
                    hotenOrder,
                    priceCharge,
                    sdtOrder,
                    payment,
                    addressOrder,
                    priceTotal,
                    priceCoupon,
                    nameCoupon,
                    statusOrder,
                    listProductCart:listProduct,
                    emailOrder,
                })
                newOrder.save(function(err) {
                    if(err){
                        res.json({status:"fail",err:err});
                    }else{
                        res.json({status:"success",idOrder:newOrder.idOrder});
                    }
                })
                
           }
              
       })

       
    }
    getHome(req,res,next){
        res.redirect("/manager/login");
    }
    sendMail(req, res) {
        //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
        var address =req.body.address;
        var idOrder = req.body.idOrder; 
        var priceTotal = req.body.priceTotal;
        var name = req.body.name;
        var transporter =  nodemailer.createTransport({ // config mail server
            service: 'gmail',
            auth: {
                user: 'dautestdau@gmail.com',
                pass: 'singsangsung@'
            }
        });
        var content = '';
        content += `
        <div style="background-color:#ffffff;color:#000000"><div class="adM">
        </div>     
          <center>
          <img src="https://image.bnews.vn/MediaUpload/Org/2021/01/23/the-coffee-house2.jpg" width="50%" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 897.797px; top: 542.5px;"><div id=":29u" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Tải xuống tệp đính kèm " data-tooltip-class="a1V" data-tooltip="Tải xuống"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div><br>
          <div style="width:90%;margin-top:32px">
          <h1 style="font-family:'AvenirNext Medium',Roboto,Helvetica,sans-serif!important;font-weight:bold;color:#fb8f19">Đơn hàng của bạn đã được tiếp nhận!</h1><br>
                <p style="text-align:left;font-family:'AvenirNext Medium',Roboto,Helvetica,sans-serif!important">Chào ${name},</p>
                <p style="text-align:left;font-family:'AvenirNext Medium',Roboto,Helvetica,sans-serif!important">Quản cà phê The Coffee House đã tiếp nhận đơn hàng của bạn. Chúng tôi đang sẽ gọi lại bạn để xác nhận đơn hàng. <b>Mã vận đơn của bạn là ${idOrder}</b></p>
                <table style="background-color:#f2f2f2;margin-top:32px;width:100%">
                    <tbody><tr style="background-color:#fb8f19">
                        <td style="padding:16px;color:#ffffff" colspan="2"><b>Thông tin giao hàng chi tiết</b></td>
                    </tr>
                    <tr>
                        <td width="50%" style="padding:16px"><b>Địa chỉ giao hàng:</b><br>${address}</td>
                    </tr>
                    <tr>
                        <td width="50%" valign="top" style="padding:16px"><b>COD:</b><br>
                        Có, ${priceTotal.toLocaleString('de-DE')}. Vui lòng chuẩn bị tiền mặt trước khi giao hàng</td>
                    </tr>
                </tbody></table>
            </div>
            </center>
          
          <center>
          <div style="margin-top:64px">
              <a href="https://client-coffeehouse.herokuapp.com/tracuudonhang" style="text-decoration:none;width:178px;height:58px;background-color:#fb8f19;color:#ffffff;font-size:19px;font-weight:bold;border-radius:4px;padding:16px 16px;font-family:'AvenirNext Medium',Roboto,Helvetica,sans-serif!important" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://u19783142.ct.sendgrid.net/ls/click?upn%3D6Uh0rL3QRKTvYhPPwrGmBBxHNUFhMIKQqX3Epk5P1GAUoIZbU7fMsGwQ1CrbZ2mttCNp_hDMc5LTXE4uJ6pdKJJe9QK49alNC1aekZeO1fB3mYQi5yMqlDmude-2B07lkTt-2Btf198I6TMxYHFsg4Yz81dLyJGv-2F3IjxFIlv-2BUgeXoLmzmATxNG64CKbPFIr70jAlBd0mjVCpbSHrqEd-2B2z-2FGxXla1wEcN187Bxc9xtM-2F-2FIVD45VpUYwJbvQl90HKajIHP8WJBipoRzJDZAB14h02-2BcqN5frBSWmI7k057YQSZBBmuErB1nverY4iEhTlBuILjXCX-2Fnp53fg1tNPSm1DnHjr1A9Yuby1XjuNQxVySFvzDjaqehDoMEiThcJe-2FMHrk6mJrzWutTFwkMPmAIOIGjSNxuc-2B57rwko9vmX4PtoG-2B36liiKDOh0rtqlwS-2FH3ahS73kaSTBNZVFRIWn8MIwZUlZKFZmfx5yrgHW9iLzgzLDFg-3D&amp;source=gmail&amp;ust=1639997412661000&amp;usg=AOvVaw0lOODECEnH5FUGsWBaTQma">Theo dõi đơn hàng</a>
          </div>
          </center>   
        </div>
        `;
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: "Quán cà phê The Coffe House <dautestdau@gmail.com>",
            to: req.body.mail,
            subject: 'Đặt hàng thành công',
            text: '',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
            html: content //Nội dung html mình đã tạo trên kia :))
        }
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                res.json({status:"fail",err:err})
            } else {
                res.json({status:"success"});
            }
        });
    };
    
    getOrder(req,res){
        var idOrder = req.query.id;
        Order.findOne({idOrder:idOrder}).lean()
        .then(order=>{
            var listProductCart = order.listProductCart;           
            //res.json(listProductCart);
           res.json({status:"success",data:order,cartProduct:listProductCart});
        })
        .catch((err)=>{
           res.json({status:"fail",err:err});
        })
    }
    detailPost(req,res){
        var slug = req.params.slug;
        Post.findOne({slug:slug}).lean()
        .then(data=>{
                res.json({status:"success",post:data});
        })
        .catch(err=>{
            res.json({status:"fail",err:err})
        })
    }
    getProducts(req,res){
        Product.find({status:{$in:["ready","bestseller"]}}).lean()
        .then(data=>{
            res.json({status:"success",dataProducts:data});
        })
        .catch((err)=>{
            res.json({status:"fail",err:err})
        })
    }
    getCategories(req,res){
        Category.find().lean()
        .then(data=>{
            res.json({status:"success",dataCategories:data});
        })
        .catch((err)=>{
            res.json({status:"fail",err:err})
        });
    }
    getPosts(req,res){
        Post.find().lean()
        .then(data=>{
            res.json({status:"success",dataPosts:data});
        })
        .catch((err)=>{
            res.json({status:"fail",err:err});
        })
    }
    
    create_payment_url(req, res, next) {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || "0.0.0.0";
        var dateFormat = require('dateformat');
        var vnp_HashSecret = "WZYWFWSEXFIPQFIKBBURLRHTMXPMRTZV";
        var vnp_TmnCode = "7FJPJWEL";
        var vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var vnp_ReturnUrl = "http://localhost:3000/cart";
        var vnp_data = "https://sandbox.vnpayment.vn/merchant_webapi/merchant.html";  
        var tmnCode = vnp_TmnCode;
        var secretKey = vnp_HashSecret;
        var vnpUrl = vnp_Url;
        var returnUrl = vnp_ReturnUrl;
        var date = new Date();
        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        var amount = req.body.priceTotal;
        var bankCode = "NCB";//req.body.bankCode;
        var orderInfo = "Thanh toán đơn hàng coffehouse";//req.body.orderDescription;
        var orderType = "billpayment"//req.body.orderType;
        var locale = "vn"//req.body.language;
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount*100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        res.json(vnpUrl);
    };
    
    vnpay_return(req, res, next) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = sortObject(vnp_Params);
        var vnp_HashSecret = "WZYWFWSEXFIPQFIKBBURLRHTMXPMRTZV";
        var vnp_TmnCode = "7FJPJWEL";
        var tmnCode = vnp_TmnCode;
        var secretKey = vnp_HashSecret;
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
        if(secureHash === signed){
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            //
            var amount = parseFloat(req.query.vnp_Amount)/100;
            var bank =req.query.vnp_BankCode;
            var numberTran =req.query.vnp_BankTranNo;
            var contentTran =req.query.vnp_OrderInfo;
            var dateFormat = require('dateformat');
            var date = req.query.vnp_PayDate
            var year = parseInt (date.substr(0,4));
            var month = parseInt (date.substr(4,2));
            var day = parseInt (date.substr(6,2));
            var hour = parseInt (date.substr(8,2));
            var min = parseInt (date.substr(10,2))
            var second = parseInt (date.substr(12,2));
            console.log(month);
            let timeTran = new Date(year,month-1,day,hour,min,second,30);
            console.log(timeTran);
            var data =[
                {
                    name:"Số giao dịch",
                    value:numberTran,
                    des:"Được cấp bởi VNPAY",
                },
                {
                    name:"Ngân hàng",
                    value:bank,
                    des:"Ngân hàng GD",
                },
                {
                    name:"Thời gian",
                    value: dateFormat(timeTran,"default"),
                    des:"Thời gian thực hiện giao dịch",
                },
                {
                    name:"Nội dung",
                    value:contentTran,
                    des:"Thông tin mô tả từ website merchant",
                },
                {
                    name:"Số tiền",
                    value:amount.toLocaleString("de-DE")+" VND",
                    des:"Số tiền giao dịch",
                },
            ]
            res.send(vnp_Params['vnp_ResponseCode]']);
        } else{
            res.json({status:'loi bao mat'})
        }
    };
   
}
function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
function makeid(length) {
    var result           = '';
    var characters       = '123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
module.exports = new homeControllers;