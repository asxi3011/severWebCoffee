
class homeControllers{
    index(req,res){
    res.render('home')
    }
    products(req,res){
        res.render('products')
    }
    cart(req,res){
        res.render('cart')
    }
   
}

module.exports = new homeControllers;