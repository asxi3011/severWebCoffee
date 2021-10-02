
const Category = require('../model/category')
const ItemCategory = require('../model/itemCategory')
const Product = require('../model/product');

const multer  = require('multer');
const { json } = require('express');
const storeage = multer.diskStorage({
    destination:'src/public/uploads',
    filename: function (req,file,cb) {
     
        cb(null,  Date.now() +'-' + file.originalname)
    }
})

var upload = multer({
    storage:storeage
})
const cpUpload = upload.fields([{ name: 'imageRepresent', maxCount: 1 }, { name: 'listImageDetails', maxCount: 8 }])
class meControllers{
    // Category > Item Category > Product
    
    //Bin Category
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
          
            res.render('PageCategorys/bin',{layout:'admin',data:newData})
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
            res.render('PageCategorys/home',{layout:'admin',data:data,numTrash:numTrash});
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
                            var nameNomarlize = normalization(element);
                           
                            var newCategory = new Category({
                            nameCategory:nameNomarlize,
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
                    var nameNomarlize = normalization(name);
                    var newCategory = new Category({
                        nameCategory: nameNomarlize,
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
            res.render('PageCategorys/edit',{layout:'admin',data:data});
        })
       
       
    }
    updateCategory(req,res,next){
        var name = req.body.nameCategory;
        var icon = req.body.iconCategory;
        var nameNomarlize = normalization(name);
       
        Category.findByIdAndUpdate({_id:req.body.idCategory},{$set:{nameCategory:nameNomarlize,iconCategory:icon}})
        .lean()
        .then(data=>{
            res.redirect('./category');
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

    //Bin ItemCategory 
    binItemCategory(req,res,next){
        Category.findOne({slug:req.params.slugCategory})
        .lean()
        .then(data=>{
                var idItemCategory = data.listCategory;
                ItemCategory.findDeleted({_id:{$in:idItemCategory}})
                .lean()
                .then(dataDelete=>{
                    var Item = dataDelete.map(element=>{
                        element.dateDeleted = element.deletedAt.toLocaleString("en-US");
                        return{name:element.nameItemCategory,id:element._id,timeDeleted:element.dateDeleted}});
        
                    res.render('PageItemCategorys/bin',{layout:'admin',data:Item,slugCategory:data.slug});
                })
              
            })
           
        .catch(next)
    }
    restoreItemCategory(req,res,next){
        
        ItemCategory.restore({_id:req.params.id},function(err){
            if(err){
                res.json(err);
            }
            else{
                res.redirect('back');
            }
        })
        
        
       
    }
    deleteOutBinItemCategory(req,res,next){
       
       ItemCategory.findByIdAndDelete({_id:req.params.id})
        .then(data=>{
                Category.findWithDeleted({slug:req.params.slugCategory})
                .lean()
                .then(reponse=>{
                    if(reponse.length===1){
                        var list = reponse[0].listCategory;
                        var idCategory = reponse[0]._id;
                        var newlist = list.filter(element=> element != req.params.id)
                        Category.updateOne({_id:idCategory},{$set:{listCategory:newlist}},function(err){
                            if(err){
                                res.json(err);
                            }
                            else{
                                res.redirect('back');
                            }
                        })
                    }
                  
                })
        })
        .catch(next);
    
        
    }
    optionServiceBinItemCategory(req,res,next){
        var caseAction = req.body.slc_action_bin;
        var groupId = req.body.chkItemCategoryDeleted;
        
        if(caseAction ==='delete'){
            ItemCategory.deleteMany({_id:{$in:groupId}})
            .then(data=>{
                  
                    Category.find({slug:req.params.slugCategory})
                   .lean()
                  .then(reponse=>{

                    if(reponse.length===1){
                        var list = reponse[0].listCategory;
                        var idCategory = reponse[0]._id;
                        var newlist = list.filter(element=> !groupId.includes(element.toString()));
                      
                 
                        Category.updateOne({_id:idCategory},{$set:{listCategory:newlist}},function(err){
                            if(err){
                                res.json(err);
                            }
                            else{
                                res.redirect('back');
                            }
                        })
                     
                       }
                        
                    })
            })
            .catch(next);
    
        }
        else if (caseAction =='restore'){
            ItemCategory.restore({_id:{$in:groupId}},function(err){
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
    //Page Item Category
    ItemCategory(req,res,next){
        Category.find()
        .lean()
        .then(data=>{
            //res.json(data)
            res.render('PageItemCategorys/home',{layout:'admin',data:data})
        })
   
    }
    getItemCategory(req,res,next){
        Category.findOne({_id:req.params.id})
        .lean()
        .then(reponse=>{
            var idItemCategory = reponse.listCategory;
            ItemCategory.findWithDeleted({_id:{$in:idItemCategory}})
            .lean()
            .then(data=>{
                var arrayDeleted =  data.filter(element=>element.deleted == true);
                var arrayNotDeleted =  data.filter(element=>element.deleted == false);
                var Item = arrayNotDeleted.map(element=>{return{name:element.nameItemCategory,id:element._id}});
                var slugCategory = reponse.slug;
                 res.json({Item:Item,slugCategory:slugCategory,numTrash:arrayDeleted.length});
            
              
            })
           
        })
        .catch(next)
    }
    storeItemCategory(req,res,next){
       var listRoot = req.body.listCategory;
       var idCategory = req.body.idCategory;
       var CovertCategory = listRoot.replace(/listCategory=/g,"");
       var testCategory = CovertCategory.replace(/%20/g," ");
      var  itemCategory = testCategory.split('&');
           ItemCategory.find({nameItemCategory:itemCategory},function(err,data){
                    try{
                        var ArrayCategory = [];
                        itemCategory.forEach((element,index) => {
                            var slug = ChangeToSlug(element)
                            var nameNormalize = normalization(element);
                           
                            var newItemCategory = new ItemCategory({
                                nameItemCategory:nameNormalize,
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
        })
        
        
    }
    removeItemCategory(req,res,next){
        ItemCategory.delete({_id:req.params.id})
        .lean()
        .then(data=>{
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }
    removeManyItemCategory(req,res,next){
        ItemCategory.delete({_id:{$in:req.body.select_Category}})
        .lean()
        .then(data=>{
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }
    editItemCategory(req,res,next){
    
        var id = req.params.id;
        
        ItemCategory.findById({_id:id})
        .lean()
        .then(data=>{
            res.render('PageItemCategorys/edit',{layout:'admin',data:data});
        })
       
    }
    updateItemCategory(req,res,next){
       
        var name = req.body.nameItemCategory;
        
        var nameNomarlize = normalization(name);
       
        ItemCategory.findByIdAndUpdate({_id:req.body.idItemCategory},{$set:{nameItemCategory:nameNomarlize}})
        .lean()
        .then(data=>{
            res.redirect('./Itemcategory');
        })
        
    }

   
    //Product 
    Product(req,res,next){
        Category.find()
        .lean()
        .then(data=>{

            res.render('PageProducts/home',{layout:'admin',dataCategory:data});
        })
      
    }
    storeProduct(req,res,next){
       
        cpUpload(req,res,function(err) {
            
            var ArrayFileImageRepresent = req.files['imageRepresent'];
            var ArrayFileImageColor = req.files['listImageDetails'];
            var ArrayNameColor = req.body.name_color;
            var ArrayPrice = req.body.price_color;
            var idCategory = req.body.Category;
            var idItemCategory = req.body.ItemCategory;
            var ArraytitleSpecification =req.body.titleSpecification;
            var ArraydetailSpecification =req.body.detailSpecification;
           
            
            if(!Array.isArray(ArrayNameColor) || !Array.isArray(ArrayPrice) ){
                ArrayNameColor = ArrayNameColor.split();
                ArrayPrice= ArrayPrice.split();
            }
            if(!Array.isArray(ArraytitleSpecification) || ! Array.isArray(ArraydetailSpecification)){
                ArraytitleSpecification = ArraytitleSpecification.split();
                ArraydetailSpecification = ArraydetailSpecification.split();
            }

            var ArrayColorDetails = ArrayFileImageColor.map((element,index)=>{
               
                    var covertPrice = Number(ArrayPrice[index]);
                    if(covertPrice === NaN){
                        res.json('lỗi nhập chữ vào ô giá')
                    }
                    else{
                     
                        return {name:ArrayNameColor[index],price:covertPrice,image:element.filename}
                    }
               
              
            })
            var listSpecifications = ArraytitleSpecification.map((element,index)=>{
                return {title:element,details:ArraydetailSpecification[index]};
            })
             var nameProduct=normalization(req.body.nameProduct);
            var slug = ChangeToSlug(nameProduct);
            const newProduct = new Product({
                nameProduct: nameProduct,
                priceStandard:normalization(req.body.PriceRoot),
                listColorDetails:ArrayColorDetails,
                imageRepresent:ArrayFileImageRepresent[0].filename,
                listSpecifications:listSpecifications,
                status:req.body.statusProduct,
                slug: slug,
            })
            
            newProduct.save(function(err,data) {
                if(err){
                    res.json(err)
                }else{
                   
                    ItemCategory.findOneAndUpdate({_id:idItemCategory},{$addToSet:{listProduct:data._id}},function(err) {
                        if(err){
                            res.json(err);
                        }else{
                            res.redirect('back');
                        }
                    })
                    
                }
            })
            
          
        })
       
          
        
    }
    dashboard(req,res,next){
      
            res.render('dashboard',{layout:'admin'});
     
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
function normalization(string) {
    var stringLowcase = string.toLowerCase();
    var stringTrim = stringLowcase.replace(/\s+/g, ' ');
    return stringTrim;
  }
module.exports = new meControllers;