class managerControllers{
   
    login(req,res){
        res.render('managerLogin',{layout:'main_NoHD'})
    }
   
}

module.exports = new managerControllers;