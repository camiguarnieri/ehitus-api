const express = require('express');
const router = express.Router();

/* Routes includes */
const root = require('../routes/root');
const usuarioRoutes = require('../routes/usuarioRoutes');
const empresaRoutes = require('../routes/empresaRoutes');
const funcionarioRoutes = require('../routes/funcionarioRoutes');
const obraRoutes = require('../routes/obraRoutes');
const parametroCargaHorariaRoutes = require('../routes/parametroCargaHorariaRoutes');
const pasosCierreHorasRoutes = require('../routes/pasosCierreHorasRoutes');
/* End Routes includes */

router.use('/', root);
router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/obras', obraRoutes);
router.use('/parametros-carga-horaria', parametroCargaHorariaRoutes);
router.use('/pasos-cierre-horas', pasosCierreHorasRoutes);


// catch 404
router.use(function (req, res) {
    const method = req.method;
    const url = req.url;
    console.log(method + " " + url + " StatusCode 404");
    res.status(404).send({ message: 'Error 404' });
});

module.exports = router;