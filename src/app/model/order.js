const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const order = new Schema({
    
    idOrder:{type:String},
    priceTotal:{type:Number},
    priceCharge:{type:Number,default:0},
    noteOrder:{type:String},
    statusOrder:{type:String,default:"inprogress"},  //in progess:đang xử lý  //Done: Hoàn tất thành công //Cancel: Hoàn tất hủy bỏ
    addressOrder:{type:String},
    hotenOrder:{type:String},
    sdtOrder:{type:String},
    listProductCart:{type:Array},
    priceCoupon:{type:Number,default:0},
    nameCoupon:{type:String},
    payment:{type:String},
},{
    timestamps:true,
})
order.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('order',order);