const express = require('express');
const router = express.Router();
const { getByFechaObra, guardar } = require('../controllers/planillaHsController');

router.get('/', getByFechaObra);
router.post('/', guardar);

module.exports = router;