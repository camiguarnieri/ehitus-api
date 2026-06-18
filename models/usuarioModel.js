const { getConnection } = require('../helpers/db');

const findByUsuario = async (usuario) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuario', usuario)
        .query("SELECT * FROM Usuarios WHERE Usuario = @usuario AND Estado = 'A'");
    return result.recordset[0] || null;
};

module.exports = { findByUsuario };