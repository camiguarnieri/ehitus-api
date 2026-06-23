const planillaModel = require('../models/planillaHsModel');
const funcionarioModel = require('../models/funcionarioModel');

const getByFechaObra = async (req, res) => {
    try {
        const { fecha, numObra } = req.query;
        if (!fecha || !numObra) {
            return res.status(400).send({ error: true, message: 'Fecha y obra requeridas' });
        }
        const codEmp = req.user.codEmp;

        const cargados = await planillaModel.getByFechaObra(fecha, numObra);
        const todos = await funcionarioModel.getByEmpresa(codEmp);
        const parametro = await planillaModel.getParametroDia();

        res.send({ error: false, data: { cargados, todos, parametro } });
    } catch (err) {
        console.log('Error getByFechaObra:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const guardar = async (req, res) => {
    try {
        const { registros } = req.body;
        if (!registros || !Array.isArray(registros)) {
            return res.status(400).send({ error: true, message: 'Registros requeridos' });
        }
        for (const r of registros) {
            await planillaModel.upsert(r);
        }
        res.send({ error: false, message: 'Guardado correctamente' });
    } catch (err) {
        console.log('Error guardar planilla:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getByFechaObra, guardar };