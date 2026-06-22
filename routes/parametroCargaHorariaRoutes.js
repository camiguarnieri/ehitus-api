const express = require('express');
const router = express.Router();
const { get, save } = require('../controllers/parametroCargaHorariaController');

router.get('/', get);
router.post('/', save);

module.exports = router;