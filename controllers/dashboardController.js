const supervisorFuncionarioModel = require('../models/supervisorFuncionarioModel');
const { getConnection } = require('../helpers/db');

const getResumen = async (req, res) => {
    try {
        console.log('dashboard req.user:', req.user);
        const { id, codEmp } = req.user;
        const pool = await getConnection();

        // Funcionarios a cargo
        const funcionarios = await supervisorFuncionarioModel.getByUsuario(id);

        // Obras activas de la empresa
        const obrasRes = await pool.request()
            .input('codEmp', codEmp)
            .query(`
        SELECT COUNT(*) AS total
        FROM Obras
        WHERE CAST(RTRIM(NroEmpresa) AS INT) = @codEmp AND EstadoObra = 1
    `);

        // Último día cargado por este usuario
        const ultimoDiaRes = await pool.request()
            .input('idUsuario', id)
            .query(`
                SELECT TOP 1 CONVERT(varchar, Fecha, 23) AS UltimaFecha
                FROM PlanillaHs
                WHERE IdUsuario = @idUsuario
                ORDER BY Fecha DESC
            `);

        // Si cargó horas hoy
        const hoyRes = await pool.request()
            .input('idUsuario', id)
            .input('hoy', new Date().toISOString().split('T')[0])
            .query(`
                SELECT COUNT(*) AS total
                FROM PlanillaHs
                WHERE IdUsuario = @idUsuario AND Fecha = @hoy
            `);

        res.send({
            error: false,
            data: {
                funcionariosACargo: funcionarios.length,
                obrasActivas: obrasRes.recordset[0].total,
                ultimaFecha: ultimoDiaRes.recordset[0]?.UltimaFecha || null,
                cargadoHoy: hoyRes.recordset[0].total > 0,
            }
        });
    } catch (err) {
        console.log('Error getResumen dashboard:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getResumen };