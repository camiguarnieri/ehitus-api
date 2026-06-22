const { getConnection } = require('../helpers/db');

const getByEmpresa = async (codEmp) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codEmp', codEmp)
        .query(`
      SELECT 
        Codigo,
        RTRIM(Apellido1) AS Apellido1,
        RTRIM(ISNULL(Apellido2, '')) AS Apellido2,
        RTRIM(Nombre1) AS Nombre1,
        RTRIM(ISNULL(Nombre2, '')) AS Nombre2,
        CodEmp,
        RTRIM(CI) AS CI,
        Estado,
        JorMen
      FROM Funcionarios
      WHERE CodEmp = @codEmp
      ORDER BY Apellido1, Nombre1
    `);
    return result.recordset;
};

const getById = async (codigo) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codigo', codigo)
        .query(`
      SELECT 
        Codigo,
        RTRIM(Apellido1) AS Apellido1,
        RTRIM(ISNULL(Apellido2, '')) AS Apellido2,
        RTRIM(Nombre1) AS Nombre1,
        RTRIM(ISNULL(Nombre2, '')) AS Nombre2,
        CodEmp,
        RTRIM(CI) AS CI,
        Estado,
        JorMen
      FROM Funcionarios
      WHERE Codigo = @codigo
    `);
    return result.recordset[0] || null;
};

const create = async ({ apellido1, apellido2, nombre1, nombre2, ci, codEmp, jorMen }) => {
    const pool = await getConnection();

    const existe = await pool.request()
        .input('ci', ci)
        .input('codEmp', codEmp)
        .query("SELECT Codigo FROM Funcionarios WHERE RTRIM(CI) = RTRIM(@ci) AND CodEmp = @codEmp");

    if (existe.recordset.length > 0) {
        throw new Error('Ya existe un funcionario con esa CI');
    }

    const maxResult = await pool.request()
        .query('SELECT ISNULL(MAX(Codigo), 0) + 1 AS NextCodigo FROM Funcionarios');
    const nextCodigo = maxResult.recordset[0].NextCodigo;

    await pool.request()
        .input('codigo', nextCodigo)
        .input('apellido1', apellido1)
        .input('apellido2', apellido2 || '')
        .input('nombre1', nombre1)
        .input('nombre2', nombre2 || '')
        .input('ci', ci)
        .input('codEmp', codEmp)
        .input('jorMen', jorMen || 'J')
        .query(`
            INSERT INTO Funcionarios (Codigo, Apellido1, Apellido2, Nombre1, Nombre2, CI, CodEmp, JorMen, Estado)
            VALUES (@codigo, @apellido1, @apellido2, @nombre1, @nombre2, @ci, @codEmp, @jorMen, 'A')
        `);
    return { Codigo: nextCodigo };
};
module.exports = { getByEmpresa, getById, create };