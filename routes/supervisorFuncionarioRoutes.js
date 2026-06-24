const express = require('express');
const router = express.Router();
const { getByUsuario, setAll } = require('../controllers/supervisorFuncionarioController');

router.get('/:idUsuario', getByUsuario);
router.put('/:idUsuario', setAll);

module.exports = router;