const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const product = new Schema({
    
    nameProduct:{type:String},
    priceStandard:{type:Number},
    descriptionProduct:{type:String},
    status:{type:String},
    priceSale:{type:Number},
    listColorDetails:{type:Array},
    imageRepresent:{type:String},
    listSpecifications:{type:Array},
    listRating:{type:Array},
    listComment:{type:Array},
  
    slug:{type:String},
},{
    timestamps:true,
})
product.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('product',product);