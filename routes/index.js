const express = require('express');
const AppController = require('../controllers/AppController.js');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/status', AppController.getStats);

export default router;