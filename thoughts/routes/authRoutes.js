const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

// login

router.get('/entrar', AuthController.login)
router.post('/login', AuthController.loginPost)

// register

router.get('/registrar', AuthController.register)
router.post('/register', AuthController.registerPost)

// logout

router.get('/logout', AuthController.logout)

module.exports = router