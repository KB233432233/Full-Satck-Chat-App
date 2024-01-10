const express = require('express');

const router = express.Router();

const controller = require('../controllers/authController');

router.post('/', controller.login);


router.post('/register', controller.register);


module.exports = router;