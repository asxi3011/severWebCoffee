const express = require('express');
const router = express.Router();
const home = require('../app/controller/homeController');

router.get('/:slug',home.products);

router.post('/order',home.storeOrder);
router.post('/storeCart',home.storeCart);
router.get('/',home.index);

module.exports = router; 