
const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:ZQpHkAwUe0lNQCFF@cluster0.dihd5.gcp.mongodb.net/WebCaPhe?retryWrites=true&w=majority"

async function connect(){
    try{
    await mongoose.connect(process.env.MongooseURL || uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
    });
    console.log('Connection success fully!!!');
    }
    catch(error){
        console.log("Connection faile:");
    }
    
}   
module.exports = { connect };