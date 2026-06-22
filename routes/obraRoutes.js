const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/obraController');

router.get('/', getAll);

module.exports = router;