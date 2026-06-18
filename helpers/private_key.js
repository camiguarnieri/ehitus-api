require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'ehitus_secret';

const value = async (username) => {
    return JWT_SECRET;
};

module.exports = { value };