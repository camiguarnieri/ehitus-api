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

        const user = await usuarioModel.findByUsuario(usuario);

        if (!user) {
            return res.status(401).send({ error: true, message: 'Usuario o contraseña incorrectos' });
        }

        if (user.Password !== password) {
            return res.status(401).send({ error: true, message: 'Usuario o contraseña incorrectos' });
        }

        const token = generateToken({
            id: user.Id,
            username: user.Usuario,
            codEmp: user.CodEmp,
            nombre: user.Nombre
        });

        const tokenConUsuario = `${user.Usuario}_${token}`;

        res.send({
            error: false,
            message: 'Login exitoso',
            data: {
                token: tokenConUsuario,
                nombre: user.Nombre,
                codEmp: user.CodEmp
            }
        });

    } catch (err) {
        console.log('Error en login:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { login };