
const Category = require('../model/category')

class meControllers{
    // Category > ChildCategory > Product
    
    //Bin
    binCategory(req,res,next){
        Category.findDeleted()
        .lean()
        .sort({deletedAt:-1})
        .then(data=>{
            var newData = data;
            newData = newData.map(element=>{
                element.date = element.deletedAt.toLocaleString("en-US")
                return element;
        });
          
            res.render('bin',{layout:'main_NoHD',data:newData})
        })
        .catch((err)=>{
            res.send(err);
        })
    }
    restoreCategory(req,res,next){
        
        Category.restore({_id:req.params.id},function(err){
            if(err){
                res.json(err);
            }
            else{
                res.redirect('back');
            }
        })
        
       
    }
    deleteOutBinCategory(req,res,next){
        Category.findByIdAndDelete({_id:req.params.id})
        .lean()
        .then(data=>{
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }
    optionServiceBin(req,res,next){
        var caseAction = req.body.slc_action_bin;
        var groupId = req.body.chkItemCategoryDeleted;
        if(caseAction ==='delete'){
            Category.deleteMany({_id:{$in:groupId}},function(err){
                if(err){
                    res.json(err);
                }
                else{
                    res.redirect('back');
                }
            })
            
        }
        else if (caseAction =='restore'){
            Category.restore({_id:{$in:groupId}},function(err){
                if(err){
                    res.json(err);
                }
                else{
                    res.redirect('back');
                }
            })
        }
        else{
            res.render('Pagenotfound');
        }

    }
    //Page Add Category 
    Category(req,res,next){  
        Promise.all([Category.find().lean(),Category.countDocumentsDeleted()])
        .then(([data,numTrash])=>{
            res.render('Category',{layout:'main_NoHD',data:data,numTrash:numTrash});
        })
    }
    storeCategory(req,res,next){    
       
        var name = req.body.nameCategory;
        var icon = req.body.iconCategory;
        
        Category.find({nameCategory:name},function(err,data){
            if(data.length==0){
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
                                res.redirect('back');
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
            }
            else{
                res.json({dataErr:data,kq:0});
            }
           
        })
         
           
    }
    updateCategory(req,res,next){
        
        Category.updateOne({nameCategory:req.body.nameCategory},{$addToSet:{listCategory: req.body.listCategory }})
        .lean()
        .then(data=>{
            res.json(data);
        })
    }
    removeCategory(req,res,next){
        Category.delete({_id:req.params.id})
        .lean()
        .then(data=>{
           
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }
    removeManyCategory(req,res,next){
        Category.delete({_id:{$in:req.body.select_Category}})
        .lean()
        .then(data=>{
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }
    //Page Add Child Category
    addChildCategory(req,res,next){
        Category.find()
        .lean()
        .then(data=>{
            //res.json(data)
            res.render('addChildCategory',{layout:'main_NoHD',data:data})
        })
   
    }
    getChildCategory(req,res,next){
        Category.findOne({nameCategory:req.params.nameCategory})
        .lean()
        .then(reponse=>{
            res.json(reponse.listCategory);
        })
        .catch(next)
    }
    //Page Add Product 
    addProduct(req,res,next){
      
       // res.render('addProduct',{layout:'main_NoHD'})
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