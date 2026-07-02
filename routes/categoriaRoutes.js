const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/categoriaController');

router.get('/', getAll);

module.exports = router;