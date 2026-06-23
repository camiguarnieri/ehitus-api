const express = require('express');
const router = express.Router();
const { login, getAll, getById, create, update, remove } = require('../controllers/usuarioController');

router.post('/login', login);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
