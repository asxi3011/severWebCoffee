const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const user = new Schema({
    
    user:{type:String},
    password:{type:String},
    hoten:{type:String},
    role:{type:String},
    slug:{type:String},
},{
    timestamps:true,
})
user.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('user',user);