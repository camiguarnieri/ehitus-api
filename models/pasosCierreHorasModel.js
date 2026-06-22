const { getConnection } = require('../helpers/db');

const get = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query('SELECT TOP 1 * FROM PasosCierreHoras ORDER BY Mes DESC');
    return result.recordset[0] || null;
};

const create = async ({ mes, enEhitus, cierreMes, traspasoMesEhitus, actualizarObras }) => {
    const pool = await getConnection();
    await pool.request()
        .input('mes', mes)
        .input('enEhitus', enEhitus || 0)
        .input('cierreMes', cierreMes || 0)
        .input('traspasoMesEhitus', traspasoMesEhitus || 0)
        .input('actualizarObras', actualizarObras || 0)
        .query(`
            INSERT INTO PasosCierreHoras (Mes, DesdeIncentivo, HastaIncentivo, EnEhitus, CierreMes, GenerarIncentivo, TraspasoMesEhitus, ActualizarObras)
            VALUES (@mes, NULL, NULL, @enEhitus, @cierreMes, 0, @traspasoMesEhitus, @actualizarObras)
        `);
};

const update = async ({ mes, enEhitus, cierreMes, traspasoMesEhitus, actualizarObras }) => {
    const pool = await getConnection();
    await pool.request()
        .input('mes', mes)
        .input('enEhitus', enEhitus || 0)
        .input('cierreMes', cierreMes || 0)
        .input('traspasoMesEhitus', traspasoMesEhitus || 0)
        .input('actualizarObras', actualizarObras || 0)
        .query(`
            UPDATE PasosCierreHoras SET
                EnEhitus = @enEhitus,
                CierreMes = @cierreMes,
                TraspasoMesEhitus = @traspasoMesEhitus,
                ActualizarObras = @actualizarObras
            WHERE Mes = @mes
        `);
};

module.exports = { get, create, update };