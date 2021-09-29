const express = require('express');
const router = express.Router();
const me = require('../app/controller/meController.js');
//Quy chuẩn dùng Method
// GET : Dùng để lấy dữ liệu
// POST : Dùng để lưu dữ liệu,ng dùng
// PUT : Dùng để chỉnh sửa ,update ,restore dữ liệu
// DELETE : Dùng để xoá dữ liệu




//Bin Category
router.get('/Category/bin',me.binCategory);
router.put('/Category/bin/restoreCategory/:id',me.restoreCategory);
router.delete('/Category/bin/deleteOutBinCategory/:id',me.deleteOutBinCategory);
router.post('/Category/bin/optionServiceBin',me.optionServiceBin);
//pageAddCategory
router.get('/Category',me.Category);
router.post('/storeCategory',me.storeCategory)
router.post('/updateCategory',me.updateCategory)
router.delete('/removeCategory/:id',me.removeCategory)
router.delete('/removeManyCategory',me.removeManyCategory)

router.get('/addProduct',me.addProduct);
router.get('/getChildCategory',me.getChildCategory)
router.get('/addChildCategory',me.addChildCategory);



module.exports = router; 