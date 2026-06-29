const express = require('express');
const router = express.Router();
const { getAll, getAllByEmpresa, getById, create, update } = require('../controllers/funcionarioController');

router.get('/todos', getAllByEmpresa);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);

module.exports = router;