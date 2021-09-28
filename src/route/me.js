const express = require('express');
const router = express.Router();
const me = require('../app/controller/meController.js');

router.get('/addProduct',me.addProduct);
router.post('/uploadCategory',me.uploadCategory)
router.post('/getChildCategory',me.getChildCategory)
router.post('/updateCategory',me.updateCategory)
router.get('/addCategory',me.addCategory);
router.get('/addChildCategory',me.addChildCategory);
//delete


module.exports = router; 