const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/private_key');
const usuarioModel = require('../models/usuarioModel');

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

const login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).send({ error: true, message: 'Usuario y contraseña requeridos' });
        }

        const userActivo = await usuarioModel.findByUsuario(usuario);
        const userExiste = await usuarioModel.findByUsuarioSinEstado(usuario);

        if (!userExiste) {
            return res.status(401).send({ error: true, message: 'Usuario o contraseña incorrectos' });
        }

        if (!userActivo) {
            return res.status(401).send({ error: true, message: 'Usuario inactivo' });
        }

        if (userActivo.Password !== password) {
            return res.status(401).send({ error: true, message: 'Usuario o contraseña incorrectos' });
        }

        const token = generateToken({
            id: userActivo.Id,
            username: userActivo.Usuario,
            codEmp: userActivo.CodEmp,
            nombre: userActivo.Nombre,
            rol: userActivo.Rol || 'supervisor'
        });

        const tokenConUsuario = `${userActivo.Usuario}_${token}`;

        res.send({
            error: false,
            message: 'Login exitoso',
            data: {
                token: tokenConUsuario,
                nombre: userActivo.Nombre,
                codEmp: userActivo.CodEmp,
                rol: userActivo.Rol || 'supervisor'
            }
        });

    } catch (err) {
        console.log('Error en login:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const isEstadoValido = (estado) => !estado || ['A', 'I'].includes(String(estado).toUpperCase());

const normalizeUsuario = (body, defaultEstado) => ({
    usuario: body.usuario ? String(body.usuario).trim() : '',
    password: body.password ? String(body.password) : '',
    codEmp: body.codEmp ? Number(body.codEmp) : null,
    nombre: body.nombre !== undefined ? String(body.nombre).trim() : undefined,
    estado: body.estado ? String(body.estado).trim().toUpperCase() : defaultEstado,
    rol: body.rol ? String(body.rol).trim().toLowerCase() : 'supervisor'
});

const getAll = async (req, res) => {
    try {
        const data = await usuarioModel.getAll();
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error getAll usuarios:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const data = await usuarioModel.getById(req.params.id);
        if (!data) return res.status(404).send({ error: true, message: 'Usuario no encontrado' });
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error getById usuario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const dataUsuario = normalizeUsuario(req.body, 'A');

        if (!dataUsuario.usuario || !dataUsuario.password || !dataUsuario.codEmp) {
            return res.status(400).send({ error: true, message: 'Usuario, password y empresa son requeridos' });
        }

        if (!isEstadoValido(dataUsuario.estado)) {
            return res.status(400).send({ error: true, message: 'Estado invalido' });
        }

        const data = await usuarioModel.create(dataUsuario);
        res.send({ error: false, data, message: 'Usuario creado correctamente' });
    } catch (err) {
        console.log('Error create usuario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const dataUsuario = normalizeUsuario(req.body);

        if (!dataUsuario.usuario || !dataUsuario.codEmp) {
            return res.status(400).send({ error: true, message: 'Usuario y empresa son requeridos' });
        }

        if (!isEstadoValido(dataUsuario.estado)) {
            return res.status(400).send({ error: true, message: 'Estado invalido' });
        }

        const data = await usuarioModel.update(req.params.id, dataUsuario);
        if (!data) return res.status(404).send({ error: true, message: 'Usuario no encontrado' });
        res.send({ error: false, data, message: 'Usuario actualizado correctamente' });
    } catch (err) {
        console.log('Error update usuario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await usuarioModel.remove(req.params.id);
        if (!deleted) return res.status(404).send({ error: true, message: 'Usuario no encontrado' });
        res.send({ error: false, message: 'Usuario dado de baja correctamente' });
    } catch (err) {
        console.log('Error delete usuario:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { login, getAll, getById, create, update, remove };
