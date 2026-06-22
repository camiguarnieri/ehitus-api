const model = require('../models/parametroCargaHorariaModel');

const get = async (req, res) => {
    try {
        const data = await model.get();
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error get parametro carga horaria:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const save = async (req, res) => {
    try {
        const existing = await model.get();
        if (existing) {
            await model.update({ ...req.body, registro: existing.Registro });
        } else {
            await model.create(req.body);
        }
        res.send({ error: false, message: 'Parámetros guardados correctamente' });
    } catch (err) {
        console.log('Error save parametro carga horaria:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { get, save };