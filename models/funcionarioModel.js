const { getConnection } = require('../helpers/db');

const camposSelect = `
    f.Codigo,
    RTRIM(f.Apellido1) AS Apellido1,
    RTRIM(ISNULL(f.Apellido2, '')) AS Apellido2,
    RTRIM(f.Nombre1) AS Nombre1,
    RTRIM(ISNULL(f.Nombre2, '')) AS Nombre2,
    f.CodEmp,
    RTRIM(f.CI) AS CI,
    f.Estado,
    f.JorMen,
    ISNULL(f.Industria, 0) AS Industria,
    ISNULL(f.Ley14411Industria, 0) AS Ley14411Industria,
    f.CodCat,
    RTRIM(ISNULL(c.Descripcion, '')) AS DescripcionCategoria
`;

const getByEmpresa = async (codEmp) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codEmp', codEmp)
        .query(`
            SELECT ${camposSelect}
            FROM Funcionarios f
            LEFT JOIN Categorias c ON c.CodCat = f.CodCat
            WHERE f.CodEmp = @codEmp
            ORDER BY f.Apellido1, f.Nombre1
        `);
    return result.recordset;
};

const getById = async (codigo) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codigo', codigo)
        .query(`
            SELECT ${camposSelect}
            FROM Funcionarios f
            LEFT JOIN Categorias c ON c.CodCat = f.CodCat
            WHERE f.Codigo = @codigo
        `);
    return result.recordset[0] || null;
};

const create = async ({ apellido1, apellido2, nombre1, nombre2, ci, codEmp, jorMen, industria, ley14411Industria, codCat }) => {
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
        .input('industria', industria ? 1 : 0)
        .input('ley14411Industria', ley14411Industria ? 1 : 0)
        .input('codCat', codCat || null)
        .query(`
            INSERT INTO Funcionarios (Codigo, Apellido1, Apellido2, Nombre1, Nombre2, CI, CodEmp, JorMen, Estado, Industria, Ley14411Industria, CodCat)
            VALUES (@codigo, @apellido1, @apellido2, @nombre1, @nombre2, @ci, @codEmp, @jorMen, 'A', @industria, @ley14411Industria, @codCat)
        `);
    return getById(nextCodigo);
};

const update = async (codigo, { apellido1, apellido2, nombre1, nombre2, ci, jorMen, estado, industria, ley14411Industria, codCat }) => {
    const pool = await getConnection();

    const current = await getById(codigo);
    if (!current) return null;

    await pool.request()
        .input('codigo', codigo)
        .input('apellido1', apellido1 || current.Apellido1)
        .input('apellido2', apellido2 !== undefined ? apellido2 : current.Apellido2)
        .input('nombre1', nombre1 || current.Nombre1)
        .input('nombre2', nombre2 !== undefined ? nombre2 : current.Nombre2)
        .input('ci', ci || current.CI)
        .input('jorMen', jorMen || current.JorMen)
        .input('estado', estado || current.Estado)
        .input('industria', industria !== undefined ? (industria ? 1 : 0) : current.Industria)
        .input('ley14411Industria', ley14411Industria !== undefined ? (ley14411Industria ? 1 : 0) : current.Ley14411Industria)
        .input('codCat', codCat !== undefined ? codCat : current.CodCat)
        .query(`
            UPDATE Funcionarios SET
                Apellido1 = @apellido1,
                Apellido2 = @apellido2,
                Nombre1 = @nombre1,
                Nombre2 = @nombre2,
                CI = @ci,
                JorMen = @jorMen,
                Estado = @estado,
                Industria = @industria,
                Ley14411Industria = @ley14411Industria,
                CodCat = @codCat
            WHERE Codigo = @codigo
        `);

    return getById(codigo);
};

module.exports = { getByEmpresa, getById, create, update };