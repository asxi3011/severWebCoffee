const express = require('express');
const router = express.Router();
const home = require('../app/controller/homeController');




router.get('/product/:slug',home.detailProduct);
router.get('/cart',home.cart);
router.post('/order',home.storeOrder);
router.post('/storeCart',home.storeCart);
router.get('/',home.index);
router.get('/:slug',home.products);
module.exports = router; 