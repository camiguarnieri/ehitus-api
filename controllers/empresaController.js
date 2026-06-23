const empresaModel = require('../models/empresaModel');

const getAll = async (req, res) => {
    try {
        const data = await empresaModel.getAll();
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error getAll empresas:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getAll };
