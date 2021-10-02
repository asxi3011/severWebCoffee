const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    
    nameProduct:{type:String},
    priceStandard:{type:Number},
    status:{type:String},
    priceSale:{type:Number},
    typeStorage:{type:Array},
    listColorDetails:{type:Array},
    imageRepresent:{type:String},
    listSpecifications:{type:Array},
    listRating:{type:Array},
    listComment:{type:Array},
  
    slug:{type:String},
},{
    timestamps:true,
})

module.exports = mongoose.model('product',product);