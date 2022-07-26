const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const categoryLevel2 = new Schema({
    nameTypeCategory:{type:String},
    parent:{type:String},
    slug:{type:String}
},{
    timestamps:true,
})
categoryLevel2.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });

module.exports = mongoose.model('categoryLevel2',categoryLevel2);