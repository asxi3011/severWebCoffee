const express = require('express');
const router = express.Router();
const home = require('../app/controller/homeController');
router.get('/cart',home.cart);
router.get('/:slug',home.products);
router.get('/',home.index);

module.exports = router; 