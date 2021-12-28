const express = require('express');
const router = express.Router();
const me = require('../app/controller/meController.js');
var validate =require('../resources/validate/user.validate');
                    //Quy chuẩn dùng Method
                    // GET : Dùng để lấy dữ liệu
                    // POST : Dùng để lưu dữ liệu,ng dùng
                    // PUT : Dùng để chỉnh sửa ,update ,restore dữ liệu
                    // DELETE : Dùng để xoá dữ liệu
//Bin Category
router.get('/Category/bin',validate.postCreate,me.binCategory);
router.put('/Category/bin/restoreCategory/:id',validate.postCreate,me.restoreCategory);
router.delete('/Category/bin/deleteOutBinCategory/:id',validate.postCreate,me.deleteOutBinCategory);
//page Category
router.get('/Category',validate.postCreate,me.Category);
router.get('/Category/edit/:id',validate.postCreate,me.editCategory);
router.put('/updateCategory',validate.postCreate,me.updateCategory) // doi sang method put
router.post('/storeCategory',validate.postCreate,me.storeCategory)
router.delete('/removeCategory/:id',validate.postCreate,me.removeCategory)
//Product
router.get('/Product',validate.postCreate,me.Product);
router.get('/getProducts/:id',validate.postCreate,me.getProducts); // API cho giỏ hàng lấy thông tin sản phẩm
router.get('/editProduct/:id',validate.postCreate,me.editProduct);
router.get('/listProduct',validate.postCreate,me.listProduct);
router.post('/storeProduct',validate.postCreate,me.storeProduct);
router.put('/updateProduct',validate.postCreate,me.updateProduct) 
router.delete('/removeProduct/:id',validate.postCreate,me.removeProduct);
//Bin Product
router.get('/binProduct/:idCategory',validate.postCreate,me.binProduct);
router.put('/bin/restoreProduct/:id',validate.postCreate,me.restoreProduct);
router.delete('/:idCategory/bin/deleteOutBinProduct/:id',validate.postCreate,me.deleteOutBinProduct);
//post
router.get('/post',validate.postCreate,me.post);
router.get('/post/edit/:id',validate.postCreate,me.editPost);
router.get('/listPost',validate.postCreate,me.listPost);
router.post('/storePost',validate.postCreate,me.storePost);
router.put('/updatePost',validate.postCreate,me.updatePost);
router.delete('/deletePost/:id',validate.postCreate,me.deletePost);
//admin
router.get('/dashboard',validate.postCreate,me.dashboard);
router.post('/getChartToDay',validate.postCreate,me.getChartToDay);
//order
router.get('/listOrder/:status',validate.postCreate,me.listOrderPending);
router.get('/listOrder',validate.postCreate,me.listOrder);
router.get('/detailsOrder/:id',validate.postCreate,me.detailsOrder);
router.post('/activeDonHang',validate.postCreate,me.activeDonHang);
router.get('/countOrderPending',validate.postCreate,me.countOrderPending);
module.exports = router; 