const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const category = new Schema({
    nameCategory:{type:String},
    imageCategory:{type:String},
    listProduct:{type:Array},
},{
    timestamps:true,
})
category.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });

module.exports = mongoose.model('category',category);