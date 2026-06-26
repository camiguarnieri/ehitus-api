const { getConnection } = require('../helpers/db');

const selectColumns = `
    Id,
    RTRIM(Usuario) AS Usuario,
    CodEmp,
    RTRIM(ISNULL(Nombre, '')) AS Nombre,
    RTRIM(ISNULL(Estado, '')) AS Estado,
    RTRIM(ISNULL(Rol, 'supervisor')) AS Rol,
    FechaAlta
`;

const findByUsuario = async (usuario) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuario', usuario)
        .query("SELECT * FROM Usuarios WHERE Usuario = @usuario AND Estado = 'A'");
    return result.recordset[0] || null;
};

const getAll = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
        SELECT
            u.Id,
            RTRIM(u.Usuario) AS Usuario,
            u.CodEmp,
            RTRIM(ISNULL(u.Nombre, '')) AS Nombre,
            RTRIM(ISNULL(u.Estado, '')) AS Estado,
            RTRIM(ISNULL(u.Rol, 'supervisor')) AS Rol,
            u.FechaAlta,
            RTRIM(ISNULL(e.Empresa, '')) AS Empresa
        FROM Usuarios u
        LEFT JOIN Empresas e ON e.CodEmp = u.CodEmp
        ORDER BY u.Usuario
        `);
    return result.recordset;
};

const getById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .query(`
            SELECT ${selectColumns}
            FROM Usuarios
            WHERE Id = @id
        `);
    return result.recordset[0] || null;
};

const existsEmpresa = async (pool, codEmp) => {
    const result = await pool.request()
        .input('codEmp', codEmp)
        .query('SELECT CodEmp FROM Empresas WHERE CodEmp = @codEmp');
    return result.recordset.length > 0;
};

const existsUsuario = async (pool, usuario, id) => {
    const request = pool.request()
        .input('usuario', usuario);

    let whereId = '';
    if (id) {
        request.input('id', id);
        whereId = 'AND Id <> @id';
    }

    const result = await request.query(`
        SELECT Id
        FROM Usuarios
        WHERE RTRIM(Usuario) = RTRIM(@usuario)
        ${whereId}
    `);
    return result.recordset.length > 0;
};

const create = async ({ usuario, password, codEmp, nombre, estado, rol }) => {
    const pool = await getConnection();

    if (await existsUsuario(pool, usuario)) {
        throw new Error('Ya existe un usuario con ese nombre');
    }

    if (!(await existsEmpresa(pool, codEmp))) {
        throw new Error('La empresa indicada no existe');
    }

    const result = await pool.request()
        .input('usuario', usuario)
        .input('password', password)
        .input('codEmp', codEmp)
        .input('nombre', nombre || '')
        .input('estado', estado || 'A')
        .input('rol', rol || 'supervisor')
        .query(`
            INSERT INTO Usuarios (Usuario, Password, CodEmp, Nombre, Estado, Rol, FechaAlta)
            OUTPUT INSERTED.Id
            VALUES (@usuario, @password, @codEmp, @nombre, @estado, @rol GETDATE())
        `);

    return getById(result.recordset[0].Id);
};

const update = async (id, { usuario, password, codEmp, nombre, estado, rol }) => {
    const pool = await getConnection();

    const current = await getById(id);
    if (!current) return null;

    if (usuario && await existsUsuario(pool, usuario, id)) {
        throw new Error('Ya existe un usuario con ese nombre');
    }

    if (codEmp && !(await existsEmpresa(pool, codEmp))) {
        throw new Error('La empresa indicada no existe');
    }

    const request = pool.request()
        .input('id', id)
        .input('usuario', usuario || current.Usuario)
        .input('codEmp', codEmp || current.CodEmp)
        .input('nombre', nombre !== undefined ? nombre : current.Nombre)
        .input('estado', estado || current.Estado || 'A')
        .input('rol', rol || current.Rol || 'supervisor');

    let passwordSet = '';
    if (password) {
        request.input('password', password);
        passwordSet = 'Password = @password,';
    }

    await request.query(`
        UPDATE Usuarios SET
            Usuario = @usuario,
            ${passwordSet}
            CodEmp = @codEmp,
            Nombre = @nombre,
            Estado = @estado,
            Rol = @rol
        WHERE Id = @id
    `);

    return getById(id);
};

const remove = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .query(`
            UPDATE Usuarios
            SET Estado = 'I'
            WHERE Id = @id
        `);
    return result.rowsAffected[0] > 0;
};

const findByUsuarioSinEstado = async (usuario) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('usuario', usuario)
        .query("SELECT * FROM Usuarios WHERE Usuario = @usuario");
    return result.recordset[0] || null;
};

module.exports = { findByUsuario, findByUsuarioSinEstado, getAll, getById, create, update, remove };

