const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const product = new Schema({
    nameProduct:{type:String},
    priceStandard:{type:Number},
    status:{type:String,default:"ready"}, // ready : còn hàng //out: hết hàng
    Size:[],
    idCategory:{type:ObjectId},
    soLuong:{type:Number},
    descriptionProduct:{type:String},
    imageRepresent:{type:String},
    listRating:{type:Array},
    slug:{type:String},
},{
    timestamps:true,
})
product.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('product',product);