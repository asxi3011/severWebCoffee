const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

const productCart = new Schema({
    idProduct:Schema.Types.ObjectId,
    priceTotal:{type:Number},
    
    sizeProduct:{type:String},
    quanityProduct:{type:Number},
    Topping:{
        idTopping:{type:Array},
        quanityTopping:{type:Array},
    },
    note:{type:String},
},{
    timestamps:true,
})
productCart.plugin(mongoose_delete,{deletedAt : true, overrideMethods: 'all' });
module.exports = mongoose.model('productCart',productCart);