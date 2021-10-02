const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
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
itemCategory.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('itemCategory',itemCategory);