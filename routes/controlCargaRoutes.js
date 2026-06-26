const express = require('express');
const router = express.Router();
const { getGrilla } = require('../controllers/controlCargaController');

router.get('/', getGrilla);

module.exports = router;