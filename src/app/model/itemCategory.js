const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemCategory = new Schema({
    nameItemCategory:{type:String},
    listProduct:{
        type:Array
    },
    slug:{type:String},
},{
    timestamps:true,
})

module.exports = mongoose.model('itemCategory',itemCategory);