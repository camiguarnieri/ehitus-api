const express = require('express');
const router = express.Router();
const { getAll, getAllByEmpresa, getById, create } = require('../controllers/funcionarioController');

router.get('/todos', getAllByEmpresa);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);

module.exports = router;