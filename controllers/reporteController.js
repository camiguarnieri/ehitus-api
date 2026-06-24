const reporteModel = require('../models/reporteModel');

const getReporte = async (req, res) => {
    try {
        const { mesDesde, mesHasta, numObra, codigo } = req.query;
        const codEmp = req.user.codEmp;

        const data = await reporteModel.getReporte({ mesDesde, mesHasta, numObra, codigo, codEmp });
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error getReporte:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getReporte };