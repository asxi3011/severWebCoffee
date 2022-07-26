const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slider = new Schema({
    nameSlider:{type:String},
    imageSlider:{type:String},
},{
    timestamps:true,
})
module.exports = mongoose.model('slider',slider);