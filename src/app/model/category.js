const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const category = new Schema({
    nameCategory:{type:String},
    iconCategory:{type:String},
    listCategory:{type:Array,default:[]},
    slug:{type:String},
},{
    timestamps:true,
})

module.exports = mongoose.model('category',category);