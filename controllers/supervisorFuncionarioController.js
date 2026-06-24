const supervisorFuncionarioModel = require('../models/supervisorFuncionarioModel');
const funcionarioModel = require('../models/funcionarioModel');


const getByUsuario = async (req, res) => {
    try {
        const data = await supervisorFuncionarioModel.getByUsuario(req.params.idUsuario);
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error getByUsuario supervisorFuncionario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};


const setAll = async (req, res) => {
    try {
        const { codigos } = req.body;
        if (!Array.isArray(codigos)) {
            return res.status(400).send({ error: true, message: 'codigos debe ser un array' });
        }
        await supervisorFuncionarioModel.setAll(Number(req.params.idUsuario), codigos);
        res.send({ error: false, message: 'Asignación actualizada correctamente' });
    } catch (err) {
        console.log('Error setAll supervisorFuncionario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getByUsuario, setAll };