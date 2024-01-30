const express = require('express');
const router = express.Router();

const controller = require('../controllers/accountController');
const authenticated = require('../middlewares/auth');


router.post('/', authenticated, controller);

module.exports = router;