const express = require('express');

const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

// Auth
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

module.exports = router;
