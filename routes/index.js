const express = require('express');

const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);

// Auth
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisConnect);
router.get('/users/me', AuthController.getMe);



module.exports = router;
