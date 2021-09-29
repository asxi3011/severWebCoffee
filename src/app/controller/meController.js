
const Category = require('../model/category')
const ItemCategory = require('../model/itemCategory')
class meControllers{
    // Category > Item Category > Product
    
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
          
            res.render('bin',{data:newData})
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
    //Page Category 
    Category(req,res,next){  
        Promise.all([Category.find().lean(),Category.countDocumentsDeleted()])
        .then(([data,numTrash])=>{
            res.render('Category',{data:data,numTrash:numTrash});
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
    editCategory(req,res,next){
        
        var id = req.params.id;
        Category.findById({_id:id})
        .lean()
        .then(data=>{
            res.render('edit',{data:data});
        })
       
       
    }
    updateCategory(req,res,next){
        Category.updateMany({_id:req.body.idCategory},{$addToSet:{listCategory: req.body.listCategory}})
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
            res.render('addChildCategory',{data:data})
        })
   
    }
    getItemCategory(req,res,next){
        Category.findOne({_id:req.params.id})
        .lean()
        .then(reponse=>{
            var idItemCategory = reponse.listCategory;
            ItemCategory.find({_id:{$in:idItemCategory}})
            .lean()
            .then(data=>{
                var nameItem = data.map(element=>element.nameItemCategory);
                res.json(nameItem);
            })
           
        })
        .catch(next)
    }
    storeItemCategory(req,res,next){
        var itemCategory = req.body.listCategory;
       var idCategory = req.body.idCategory;
        ItemCategory.find({nameItemCategory:itemCategory},function(err,data){
            if(data.length==0){
                if(Array.isArray(itemCategory))
                {
                    try{
                        var ArrayCategory = [];
                        itemCategory.forEach((element,index) => {
                            var slug = ChangeToSlug(element)
                            var nameLowerCase = element.toLowerCase();
                           
                            var newItemCategory = new ItemCategory({
                                nameItemCategory:nameLowerCase,
                            slug:slug,
                            })
                            ArrayCategory.push(newItemCategory);
                    
                        });
                        ItemCategory.insertMany(ArrayCategory,function(err,data){
                            if(err){
                                res.json('save failed')
                            }else{
                                const arrayIdItem =data.map(element=>element._id);
                                Category.findByIdAndUpdate({_id:idCategory},{$addToSet:{listCategory:arrayIdItem}})
                                .lean()
                                .then(data=>{
                                    res.redirect('back');
                                })
                                
                               
                            }
                        });
                        
                    }
                    catch{
                        res.json('Save fail. Try again !')
                    }
                }
                else
                {
                    var slug = ChangeToSlug(itemCategory)
                    var newItemCategory = new ItemCategory({
                        nameItemCategory: itemCategory,
                     
                        slug:slug,
                    })
                    newItemCategory.save(function(err,data){
                        if(err){
                            res.json('save fail : ' +err)
                        }else{
                         
                            Category.findByIdAndUpdate({_id:req.body.idCategory},{$addToSet:{listCategory: data._id}})
                            .lean()
                            .then(data=>{
                                res.redirect('back');
                            })
                            
                        }
                    });
                } 
            }
            else{
                res.json('loi trung ten');
            }
           
        })
         
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