const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category = new Schema({
    nameCategory:{type:String},
    listChildItemsCategory:{
        type:Array
    }
},{
    timestamps:true,
})

module.exports = mongoose.model('category',category);