const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const order = new Schema({
    
    idOrder:{type:String},
    priceTotal:{type:Number},
    priceSale:{type:Number,default:0},
    noteOrder:{type:String},
    statusOrder:{type:String}, //pending: chờ duyệt , //in progess đã duyệt (đang làm,đang giao) //Done: Hoàn tất //Cancel
    addressOrder:{type:String},
    hotenOrder:{type:String},
    sdtOrder:{type:String},
    listProductCart:{type:Array},
},{
    timestamps:true,
})
order.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('order',order);