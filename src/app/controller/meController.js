
const Category = require('../model/category')
var slugify = require('slugify');
class meControllers{
   
    addProduct(req,res,next){
        res.json('123');
       // res.render('addProduct',{layout:'main_NoHD'})
    }
    addCategory(req,res,next){
        Category.find()
        .lean()
        .then(data=>{
            //res.json(data)
            res.render('addCategory',{layout:'main_NoHD',data:data})
        })
    }
    uploadCategory(req,res,next){
        var name = req.body.nameCategory;
        var icon = req.body.iconCategory;

        if(Array.isArray(name))
        {
            try{
                
                var ArrayCategory = [];
                name.forEach((element,index) => {
                    var slug = ChangeToSlug(element)
                    var nameLowerCase = element.toLowerCase();
                    var newCategory = new Category({
                       nameCategory:nameLowerCase,
                       iconCategory:icon[index],
                       slug:slug,
                    })
                
                    ArrayCategory.push(newCategory);
                });
                Category.insertMany(ArrayCategory,function(err){
                    if(err){
                        res.json('save failed')
                    }else{
                        res.redirect('back',{kqAlert:1});
                    }
                });
                
            }
            catch{
                res.json('Save fail. Try again !')
            }
        }
        else
        {
            var slug = ChangeToSlug(name)
            var newCategory = new Category({
                nameCategory: name,
                iconCategory:icon,
                slug:slug,
            })
            newCategory.save(function(err){
                if(err){
                    res.json('save fail : ' +err)
                }else{
                    res.redirect('back')
                }
            });
        }
        
        /*
        var newCaegory = new Category({
            nameCategory:name,
        })
      
       
        */
    }
    
    updateCategory(req,res,next){
        
        Category.updateOne({nameCategory:req.body.nameCategory},{$addToSet:{listCategory: req.body.listCategory }})
        .lean()
        .then(data=>{
            res.json(data);
        })
    }
    
    addChildCategory(req,res,next){
        Category.find()
        .lean()
        .then(data=>{
            //res.json(data)
            res.render('addChildCategory',{layout:'main_NoHD',data:data})
        })
   
    }
    getChildCategory(req,res,next){
        Category.findOne({nameCategory:req.body.nameCategory})
        .lean()
        .then(reponse=>{
            res.json(reponse.listCategory);
        })
        .catch(next)
    }
    
}
function ChangeToSlug(input)
{
    var slug;
    const formName = input;
    slug = formName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .split(" ")
      .join("-");
    
    return slug;
}

module.exports = new meControllers;