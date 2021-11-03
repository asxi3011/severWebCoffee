const Order = require('../model/order')
const ProductCart = require('../model/productCart');
const Product = require('../model/product');

class homeControllers{
    index(req,res){
    res.render('home')
    }
    products(req,res){
      
        res.render('products')
    }
    storeOrder(req,res){
        var idDonHang = makeid(12);
        Order.find({idOrder:idDonHang})
        .lean()
       .then(data=>{
           if(data.length >0){
                res.send('đã có mã này rồi,vui lòng thử lại');
           }else{
                var statusOrder =req.body.statusOrder;
                var addressOrder=req.body.addressOrder;
                var hotenOrder =req.body.hotenOrder;
                var sdtOrder =req.body.sdtOrder;
                var noteOrder= req.body.note;
                var hotenOrder = req.body.hotenOrder;
                var sdtOrder = req.body.sdtOrder;
                
                var listProduct = [{id:"61794ac15516bb7d74dc3814",quanity:3},{id:"61795dd74565ec038115b0d2",quanity:2}];
                const newOrder = new Order({
                    idOrder:idDonHang,
                // priceStandard:{type:Number},
                   
                    noteOrder,
                    hotenOrder,
                    sdtOrder,
                    statusOrder,
                    addressOrder,
                    sdtOrder,
                    priceTotal:0,
                    listProductOrder:listProduct,
                    
                })
                newOrder.save(function(err) {
                    if(err){
                        res.json(err);
                    }else{
                        res.json('save successfully');
                    }
                })
           }
              
       })

       
    }
    cart(req,res){
        res.render('cart')
    }
    storeCart(req,res,next){
        var idProduct = req.body.idProduct;
        //var priceTotal = req.body.priceTotal;
        var quanityProduct = req.body.quanityProduct;
     
       var  note = req.body.note;
       var sizeProduct = req.body.sizeProduct;
       var topping = req.body.topping;
       var idOrder = req.body.idOrder;

      
        const newProductCart = new ProductCart({
            idProduct,
       
            quanityProduct,
            sizeProduct,
            topping,
            note,
        })
        
        newProductCart.save(function(err){
            if(err){
                res.json(err);
            }
            else{
                Order.findByIdAndUpdate({_id:idOrder},{$push:{listProductCart:newProductCart._id}},function(err){
                    if(err){
                        res.json(err)
                    }
                    else{
                        res.json("save successfully");
                    }
                })
                
            }
        })
    }
   
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
module.exports = new homeControllers;