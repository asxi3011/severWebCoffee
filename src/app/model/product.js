const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.plugin(slug);
const product = new Schema({
    
    brand:{type:String},
    nameProduct:{type:String},
    priceStandard:{type:Number},
    priceSale:{type:Number},
    typeStorage:{type:Array},
    listColor:{type:Array},
    imageRepresent:{type:String},
    listImageDetails:{type:Array},
    listSpecifications:{type:Array},
    listRating:{type:Array},
    listComment:{type:Array},
},{
    timestamps:true,
})

module.exports = mongoose.model('product',product);