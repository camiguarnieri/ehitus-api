const planillaModel = require('../models/planillaHsModel');
const supervisorFuncionarioModel = require('../models/supervisorFuncionarioModel'); // ← agregar
const funcionarioModel = require('../models/funcionarioModel');

const getByFechaObra = async (req, res) => {
    try {
        const { fecha, numObra } = req.query;
        console.log('getByFechaObra:', fecha, numObra, req.user);
        if (!fecha || !numObra) {
            return res.status(400).send({ error: true, message: 'Fecha y obra requeridas' });
        }

        const { id: idUsuario, codEmp, rol } = req.user;
        const cargados = await planillaModel.getByFechaObra(fecha, numObra);
        const todos = rol === 'admin'
            ? await funcionarioModel.getByEmpresa(codEmp)
            : await supervisorFuncionarioModel.getByUsuario(idUsuario);
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
        const idUsuario = req.user.id;
        console.log('idUsuario:', idUsuario); // ← para verificar
        for (const r of registros) {
            await planillaModel.upsert({ ...r, idUsuario }); // ← faltaba el spread
        }
        res.send({ error: false, message: 'Guardado correctamente' });
    } catch (err) {
        console.log('Error guardar planilla:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getByFechaObra, guardar };