const { getConnection } = require('../helpers/db');

const getAll = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
            SELECT
                CodEmp,
                RTRIM(Empresa) AS Empresa
            FROM Empresas
            ORDER BY Empresa
        `);
    return result.recordset;
};

module.exports = { getAll };
