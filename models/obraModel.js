const { getConnection } = require('../helpers/db');

const getByEmpresa = async (codEmp) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codEmp', codEmp)
        .query(`
            SELECT 
                NumObra,
                RTRIM(Descripcion) AS Descripcion,
                EstadoObra,
                RTRIM(ISNULL(NroEmpresa, '')) AS NroEmpresa
            FROM Obras
            WHERE RTRIM(NroEmpresa) = RTRIM(CAST(@codEmp AS NVARCHAR))
            ORDER BY Descripcion
        `);
    return result.recordset;
};

module.exports = { getByEmpresa };