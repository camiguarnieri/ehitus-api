const { getConnection } = require('../helpers/db');

const get = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query('SELECT TOP 1 * FROM ParametroCargaHoraria');
    return result.recordset[0] || null;
};

const create = async ({ lunes, martes, miercoles, jueves, viernes, sabado, domingo }) => {
    const pool = await getConnection();
    await pool.request()
        .input('lunes', lunes)
        .input('martes', martes)
        .input('miercoles', miercoles)
        .input('jueves', jueves)
        .input('viernes', viernes)
        .input('sabado', sabado)
        .input('domingo', domingo)
        .query(`
            INSERT INTO ParametroCargaHoraria (Registro, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo)
            VALUES (1, @lunes, @martes, @miercoles, @jueves, @viernes, @sabado, @domingo)
        `);
};
const update = async ({ lunes, martes, miercoles, jueves, viernes, sabado, domingo, registro }) => {
    const pool = await getConnection();
    await pool.request()
        .input('lunes', lunes)
        .input('martes', martes)
        .input('miercoles', miercoles)
        .input('jueves', jueves)
        .input('viernes', viernes)
        .input('sabado', sabado)
        .input('domingo', domingo)
        .input('registro', registro)
        .query(`
            UPDATE ParametroCargaHoraria SET
                Lunes = @lunes,
                Martes = @martes,
                Miercoles = @miercoles,
                Jueves = @jueves,
                Viernes = @viernes,
                Sabado = @sabado,
                Domingo = @domingo
            WHERE Registro = @registro
        `);
};

module.exports = { get, create, update };