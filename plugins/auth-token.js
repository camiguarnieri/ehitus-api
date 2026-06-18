const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/private_key');

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };