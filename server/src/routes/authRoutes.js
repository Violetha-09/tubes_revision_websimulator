const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../validations/authValidator');

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);

module.exports = router;
