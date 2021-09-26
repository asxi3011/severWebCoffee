const Category = require('../model/category')
class meControllers{
   
    addProduct(req,res,next){
        res.json('123');
       // res.render('addProduct',{layout:'main_NoHD'})
    }
    addCategory(req,res,next){
       res.render('addCategory',{layout:'main_NoHD'})
    }
    uploadCategory(req,res,next){
        var name = req.body.nameCategory;
        var list = req.body.listChildItemsCategory;
        var newCaegory = new Category({
            nameCategory:name,
            listChildItemsCategory:list,
        })
        newCaegory.save(function(err){
            if(err){
                res.json('save fail : ' +err)
            }else{
                res.json('save success')
            }
        });
    }
    updateCategory(req,res,next){
        Category.find()
        .lean()
        .then(data=>{
            res.json(data);
        })
    }
    
    addChildCategory(req,res,next){
        res.render('addChildCategory',{layout:'main_NoHD'})
    }
   
}

module.exports = new meControllers;