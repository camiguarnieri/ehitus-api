const express = require('express');
const router = express.Router();

/* Routes includes */
const root = require('../routes/root');
const usuarioRoutes = require('../routes/usuarioRoutes');
const empresaRoutes = require('../routes/empresaRoutes');
const funcionarioRoutes = require('../routes/funcionarioRoutes');
const obraRoutes = require('../routes/obraRoutes');
/* End Routes includes */

router.use('/', root);
router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/obras', obraRoutes);

// catch 404
router.use(function (req, res) {
    const method = req.method;
    const url = req.url;
    console.log(method + " " + url + " StatusCode 404");
    res.status(404).send({ message: 'Error 404' });
});

module.exports = router;