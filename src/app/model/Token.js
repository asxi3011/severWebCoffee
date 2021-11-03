const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Token = new Schema({
    Token:{type:String},
    UserId:{type:String},
    RegisterDate:{type:Date},
    State:{type:Boolean},
})

module.exports = mongoose.model('token',Token);