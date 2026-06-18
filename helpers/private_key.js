require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'ehitus_secret';

module.exports = { JWT_SECRET };