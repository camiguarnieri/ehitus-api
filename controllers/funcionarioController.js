const funcionarioModel = require('../models/funcionarioModel');

const getAll = async (req, res) => {
    console.log('req.user:', req.user);
    try {
        const codEmp = req.user.codEmp;
        const data = await funcionarioModel.getByEmpresa(codEmp);
        res.send({ error: false, data });
    } catch (err) {
        res.status(500).send({ error: true, message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const data = await funcionarioModel.getById(req.params.id);
        if (!data) return res.status(404).send({ error: true, message: 'Funcionario no encontrado' });
        res.send({ error: false, data });
    } catch (err) {
        res.status(500).send({ error: true, message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const codEmp = req.user.codEmp;
        const data = await funcionarioModel.create({ ...req.body, codEmp });
        res.send({ error: false, data, message: 'Funcionario creado correctamente' });
    } catch (err) {
        console.log('Error create funcionario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getAll, getById, create };