const express = require('express');
const router = express.Router();
const manager = require('../app/controller/managerController.js');
router.get('/login',manager.login);


module.exports = router; 