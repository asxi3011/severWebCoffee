const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Topping = new Schema({
    name:{type:String}, 
    priceExtra:{type:String},
     unit:{type:String},
    
},{timestamps:true},)

module.exports = mongoose.model('topping',Topping);
