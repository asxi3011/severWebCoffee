
const Category = require('../model/category')
const Product = require('../model/product');
const Order = require('../model/order');
const Topping = require('../model/topping');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const multer  = require('multer');
const productCart = require('../model/productCart');


const storeage = multer.diskStorage({
    destination:'src/public/uploads',
    filename: function (req,file,cb) {
     
        cb(null,  Date.now() +'-' + file.originalname)
    }
})

var upload = multer({
    storage:storeage
})
const uploadProduct = upload.single('imageProduct');
const uploadCategory = upload.array('imageCategory');
const uploadCategorySingle = upload.single('imageCategory');
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
          
            res.render('adminPage/PageCategorys/bin',{layout:'admin',data:newData})
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
            res.render('adminPage/PageCategorys/home',{layout:'admin',data:data,numTrash:numTrash});
        })
    }
    storeCategory(req,res,next){  
      uploadCategory(req,res,function(err) {
          
          var arrayImage = req.files;
          var arrayNameCategory = req.body.nameCategory;
          var arrayCateogry = [];
          arrayNameCategory.forEach((element,index)=>{
                var category = new Category({
                    nameCategory:normalization(element),
                    imageCategory:arrayImage[index].filename,
                    slug: ChangeToSlug(element),
                })
                arrayCateogry.push(category);   
          })
          Category.insertMany(arrayCateogry,function(err){
              if(err){

              }else{
                res.redirect('back');
              }
          });
        
        
      })
     
       
           
    }
    editCategory(req,res,next){
        
        var id = req.params.id;
        Category.findById({_id:id})
        .lean()
        .then(data=>{
            res.render('adminPage/PageCategorys/edit',{layout:'admin',data:data});
        })
       
       
    }
    updateCategory(req,res,next){
        //var name = req.body.nameCategory;
        //var icon = req.body.iconCategory;
        //var nameNomarlize = normalization(name);
        uploadCategorySingle(req,res,function(err){
            var idCategory = req.body.idCategory;
            var nameCategory = req.body.nameCategory;
            if(req.file){
                Category.findByIdAndUpdate({_id:idCategory},{$set:{nameCategory:normalization(nameCategory),imageCategory:req.file.filename}})
                .lean()
                .then(data=>{
                    res.redirect('./category');
                })
            }
            else{
                Category.findByIdAndUpdate({_id:idCategory},{$set:{nameCategory:normalization(nameCategory)}})
                .lean()
                .then(data=>{
                    res.redirect('./category');
                })
            }
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
        
                    res.render('adminPage/PageItemCategorys/bin',{layout:'admin',data:Item,slugCategory:data.slug});
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
            res.render('adminPage/PageItemCategorys/home',{layout:'admin',data:data})
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
        .catch(err=>{
            res.status(404).json({Msg:"Không có dữ liệu"});
        })
    }
    storeItemCategory(req,res,next){
       var listRoot = req.body.listCategory;
       var idCategory = req.body.idCategory;
           ItemCategory.find({nameItemCategory:listRoot},function(err,data){
                    try{
                        var ArrayCategory = [];
                        listRoot.forEach((element,index) => {
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
            res.render('adminPage/PageItemCategorys/edit',{layout:'admin',data:data});
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
        Promise.all([Category.find().lean(),Topping.find().lean()])
      
        .then(([data,dataTopping])=>{
            
            res.render('adminPage/PageProducts/add',{layout:'admin',dataCategory:data,dataTopping:dataTopping});
        })
    }
    getProduct(req,res,next){
       var idCategory=req.params.id
        Category.findOne({_id:idCategory})
        .lean()
        .then(reponse=>{
            var listIdProduct = reponse.listProduct;
            Product.findWithDeleted({_id:{$in:listIdProduct}})
            .lean()
            .then(data=>{
                var arrayDeleted =  data.filter(element=>element.deleted == true);
                var arrayNotDeleted =  data.filter(element=>element.deleted == false);
              
              
                 res.json({dataProduct:arrayNotDeleted,dataCount:arrayDeleted.length});
            })
        })
        .catch(err=>{
            res.status(404).json({Msg:"Không có dữ liệu"});
        })
    }
    listProduct(req,res,next){
        Category.find()
        .lean()
        .then(data=>{

            res.render('adminPage/PageProducts/home',{layout:'admin',dataCategory:data});
        })
    }
    storeProduct(req,res,next){
     
        uploadProduct(req,res,function(err){
           
              
            var idCategory =req.body.Category;
            var nameProduct =req.body.nameProduct;
            var PriceRoot =req.body.PriceRoot;
            var productDescription =req.body.productDescription;
            var listSize = req.body.listSize;
            var listPriceExtra =req.body.listPriceExtra;
            var extraTopping = req.body.extraTopping;
            var slug = ChangeToSlug(nameProduct);
            var arraySize = {
                nameSize:listSize,
                extraSize:listPriceExtra,
            };
        
           
            var convertExtraTopping = extraTopping.map(topping=>ObjectId(topping));
            var newProduct = new Product({
                nameProduct,
                priceStandard:PriceRoot,
                descriptionProduct:productDescription,
                imageRepresent:req.file.filename,
                Size:arraySize,
                slug,
                listTopping:convertExtraTopping,
            })
            newProduct.save(function(err){
                if(err){
                    res.json(err);
                }else{
                    Category.findByIdAndUpdate({_id:idCategory},{$addToSet:{listProduct:newProduct._id}})
                    .lean()
                    .then(data=>{
                        res.redirect('back');
                    })
                }
            });
        
        })
        
    }
    removeProduct(req,res,next){
    
        Product.delete({_id:req.params.id})
        .lean()
        .then(data=>{
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }

    removeManyProduct(req,res,next){
        
        Product.delete({_id:{$in:req.body.chkName}})
        .lean()
        .then(data=>{
            res.redirect('back');
        })
        .catch(()=>{
            res.render('SomeThingWrong');
        })
    }

    updateProduct(req,res,next){
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
                priceStandard:req.body.PriceRoot,
                listColorDetails:ArrayColorDetails,
                imageRepresent:ArrayFileImageRepresent[0].filename,
                listSpecifications:listSpecifications,
                status:req.body.statusProduct,
                slug: slug,
            })
            res.json(newProduct);
        
        
        })
    }
    editProduct(req,res,next){
        Product.findById({_id:req.params.id})
        .lean()
        .then(data=>{
            var typeColor =data.listColorDetails;
            var listSpecifications = data.listSpecifications;
            res.render('adminPage/PageProducts/edit',{layout:'admin',product:data,typeColor:typeColor,listSpecifications:listSpecifications})
        })
    }
    //Bin Product
    binProduct(req,res,next){

        Category.findOne({_id:req.params.idCategory})
        .lean()
        .then(data=>{
                var idProduct = data.listProduct;
    
                Product.findDeleted({_id:{$in:idProduct}})
                .lean()
                .then(dataDelete=>{
                    var Item = dataDelete.map(element=>{
                        element.dateDeleted = element.deletedAt.toLocaleString("en-US");
                        return element;
                    });
                  
                res.render('adminPage/PageProducts/bin',{layout:'admin',data:Item,idCategory:req.params.idCategory});
               
                })  
            })
           
        .catch(next)
       // res.json(req.params.idItemCategory);
    }
    restoreProduct(req,res,next){
        Product.restore({_id:req.params.id},function(err){
            if(err){
                res.json(err);
            }
            else{
                res.redirect('back');
            }
        })
        
    }
    deleteOutBinProduct(req,res,next){
        var idCategory =req.params.idCategory;
        var idProduct = req.params.id;
    
        
        Product.findByIdAndDelete({_id:idProduct})
        .then(data=>{
                Category.findOne({_id:idCategory})
                .lean()
                .then(reponse=>{
                    
                        var list = reponse.listProduct;
                        var idCategory = reponse._id;
                        var newlist = list.filter(element=> element != req.params.id)
                        Category.updateOne({_id:idCategory},{$set:{listProduct:newlist}},function(err){
                            if(err){
                                res.json(err);
                            }
                            else{
                                res.redirect('back');
                            }
                        })
                   
                  
                })
        })
        .catch(next);
        
    }
    optionServiceBinProduct(req,res,next){
        var caseAction = req.body.slc_action_bin;
        var groupId = req.body.chkName;
        var idCategory =req.body.idCategory;
      
        
        if(caseAction ==='delete'){
            Product.deleteMany({_id:{$in:groupId}})
            .then(data=>{
                    Category.findOne({_id:idCategory})
                   .lean()
                  .then(reponse=>{
                        var listProduct= reponse.listProduct;
                    
                        //trả về mảng mới kh chưa mấy p tử đã xoá
                        var newlist = listProduct.filter(element=> !groupId.includes(element.toString()));
                        Category.updateOne({_id:idCategory},{$set:{listProduct:newlist}},function(err){
                            if(err){
                                res.json(err);
                            }
                            else{
                                res.redirect('back');
                            }
                        })
                        
                         
                    })
                   
            })
            .catch(next);
    
        }
        else if (caseAction =='restore'){
            Product.restore({_id:{$in:groupId}},function(err){
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
    
    //Đơn hàng
    //Danh sach 
    listOrder(req,res,next){
    
        Order.find({})
        .lean()
        .sort({createdAt:-1})
        .then(data=>{
            
            var newData = data;
            newData = newData.map(element=>{
                element.dateConvert = element.createdAt.toLocaleString("en-US",{dateStyle:"medium"});
                return element;
            })
       
           res.render('adminPage/Order/listOrder',{layout:'admin',data:newData})
        })
    }

    listOrderPending(req,res,next){
        var status = req.params.status;
        Order.find({statusOrder:status})
        .lean()
        .sort({createdAt:-1})
        .then(data=>{
            
            var newData = data;
            newData = newData.map(element=>{
                element.dateConvert = element.createdAt.toLocaleString("en-US");
                return element;
            })
           res.render('adminPage/Order/listOrder',{layout:'admin',data:newData})
        })
    }

    activeDonHang(req,res,next){
        var id = req.body.id;
        var status =req.body.status;
        Order.findByIdAndUpdate({_id:id},{$set:{statusOrder:status}})
        .lean()
        .then(data=>{
            res.json('success');
        })
    }
    
    detailsOrder(req,res,next){
            var id = req.params.id;

            
            Order.findById({_id:id}).lean()
            .then(order=>{
                var listProductCart = order.listProductCart;
                 
                productCart.aggregate([
                    {
                        $lookup:{
                            from:"products",
                            localField:"idProduct",
                            foreignField:"_id",
                            as:"cartProduct"
                        }
                       
                    }, {
                            $match:{
                            _id:{$in:listProductCart}
                        }  
                    },{
                        $project:{
                            _id:0,
                        }
                    },{
                        $unwind:"$cartProduct" // giúp trả về object
                        
                    }
                   ],function(err,cartProduct){ // data này là mảng chứ 
                      
                        //res.json(cartProduct);
                       res.render("adminPage/Order/detailsOrder",{layout:"admin",data:order,cartProduct:cartProduct})
                   })

            })
            
       
    }
    
    countOrderPending(req,res,next){
        var status = 'pending';
        Order.find({statusOrder:status})
        .lean()
        .then(data=>{
            
           res.json(data.length);
        })
    }
    //dashboard
    dashboard(req,res,next){
     
        var user = res.locals.user;
   

        res.render('dashboard',{layout:'admin',user:user});
     
    }
    addTopping(req,res,next){
        res.render('adminPage/PageTopping/add',{layout:'admin'});
    }
    listTopping(req,res,next){
        Topping.find()
        .lean()
        .then(data=>{
            res.render('adminPage/PageTopping/list',{layout:'admin',data:data});
        })
    }
    storeTopping(req,res,next){
        
        const newTopping = new Topping({
            name:req.body.nameTopping,
            priceExtra:req.body.PriceTopping,
            unit:req.body.unitTopping,
        })
        newTopping.save(function(err){
            if(err)
                res.json(err);
            else{
                res.redirect('back');
            }
        })
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