const funcionarioModel = require('../models/funcionarioModel');
const supervisorFuncionarioModel = require('../models/supervisorFuncionarioModel');

const getAll = async (req, res) => {
    try {
        const { codEmp, id, rol } = req.user;
        const data = rol === 'admin'
            ? await funcionarioModel.getByEmpresa(codEmp)
            : await supervisorFuncionarioModel.getByUsuario(id);
        res.send({ error: false, data });
    } catch (err) {
        res.status(500).send({ error: true, message: err.message });
    }
};

const getAllByEmpresa = async (req, res) => {
    try {
        const { codEmp } = req.user;
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

const update = async (req, res) => {
    try {
        const data = await funcionarioModel.update(Number(req.params.id), req.body);
        if (!data) return res.status(404).send({ error: true, message: 'Funcionario no encontrado' });
        res.send({ error: false, data, message: 'Funcionario actualizado correctamente' });
    } catch (err) {
        console.log('Error update funcionario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};
module.exports = { getAll, getAllByEmpresa, getById, create, update };