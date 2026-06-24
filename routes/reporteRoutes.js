const express = require('express');
const router = express.Router();
const { getReporte } = require('../controllers/reporteController');

router.get('/', getReporte);

module.exports = router;