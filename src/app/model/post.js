const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const post = new Schema({
    title:{type:String},
    image:{type:String},
    content:{type:String},
    slug:{type:String}
},{
    timestamps:true,
})
module.exports = mongoose.model('post',post);