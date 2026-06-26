const express = require('express');
const router = express.Router();
const { getByFuncionarioPeriodo } = require('../controllers/cargaFuncionarioController');

router.get('/', getByFuncionarioPeriodo);

module.exports = router;