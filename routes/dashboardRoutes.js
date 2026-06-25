const express = require('express');
const router = express.Router();
const { getResumen } = require('../controllers/dashboardController');

router.get('/', getResumen);

module.exports = router;