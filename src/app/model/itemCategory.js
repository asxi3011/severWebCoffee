const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.plugin(slug);
const itemCategory = new Schema({
    nameItemCategory:{type:String},
    listChild:{
        type:Array
    }
},{
    timestamps:true,
})

module.exports = mongoose.model('itemCategory',itemCategory);