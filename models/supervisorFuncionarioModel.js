const { getConnection } = require('../helpers/db');

const getByUsuario = async (idUsuario) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('idUsuario', idUsuario)
        .query(`
            SELECT 
                f.Codigo,
                RTRIM(f.Apellido1) AS Apellido1,
                RTRIM(ISNULL(f.Apellido2, '')) AS Apellido2,
                RTRIM(ISNULL(f.Nombre1, '')) AS Nombre1,
                RTRIM(ISNULL(f.Nombre2, '')) AS Nombre2,
                RTRIM(f.CI) AS CI,
                f.Estado,
                f.JorMen,
                f.CodEmp
            FROM SupervisorFuncionario sf
            JOIN Funcionarios f ON f.Codigo = sf.CodigoFuncionario
            WHERE sf.IdUsuario = @idUsuario
            ORDER BY f.Apellido1
        `);
    return result.recordset;
};

// Agregar relación
const assign = async (idUsuario, codigoFuncionario) => {
    const pool = await getConnection();
    // Ignorar si ya existe
    await pool.request()
        .input('idUsuario', idUsuario)
        .input('codigoFuncionario', codigoFuncionario)
        .query(`
            IF NOT EXISTS (
                SELECT 1 FROM SupervisorFuncionario
                WHERE IdUsuario = @idUsuario AND CodigoFuncionario = @codigoFuncionario
            )
            INSERT INTO SupervisorFuncionario (IdUsuario, CodigoFuncionario)
            VALUES (@idUsuario, @codigoFuncionario)
        `);
};

// Eliminar relación
const unassign = async (idUsuario, codigoFuncionario) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('idUsuario', idUsuario)
        .input('codigoFuncionario', codigoFuncionario)
        .query(`
            DELETE FROM SupervisorFuncionario
            WHERE IdUsuario = @idUsuario AND CodigoFuncionario = @codigoFuncionario
        `);
    return result.rowsAffected[0] > 0;
};

// Reemplazar todos los asignados de un usuario de una vez
const setAll = async (idUsuario, codigos) => {
    const pool = await getConnection();
    const transaction = pool.transaction();
    await transaction.begin();
    try {
        await transaction.request()
            .input('idUsuario', idUsuario)
            .query(`DELETE FROM SupervisorFuncionario WHERE IdUsuario = @idUsuario`);

        for (const codigo of codigos) {
            await transaction.request()
                .input('idUsuario', idUsuario)
                .input('codigo', codigo)
                .query(`INSERT INTO SupervisorFuncionario (IdUsuario, CodigoFuncionario) VALUES (@idUsuario, @codigo)`);
        }

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

module.exports = { getByUsuario, assign, unassign, setAll };