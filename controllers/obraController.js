const obraModel = require('../models/obraModel');

const getAll = async (req, res) => {
    try {
        const codEmp = req.user.codEmp;
        const data = await obraModel.getByEmpresa(codEmp);
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error getAll obras:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getAll };