const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const size = new Schema({
    nameSize:{type:String},
    priceSize:{type:Number},
},{
    timestamps:true,
})

module.exports = mongoose.model('size',size);