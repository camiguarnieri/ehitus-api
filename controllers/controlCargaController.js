const { getConnection } = require('../helpers/db');
const supervisorFuncionarioModel = require('../models/supervisorFuncionarioModel');
const funcionarioModel = require('../models/funcionarioModel');

const getGrilla = async (req, res) => {
    try {
        const { fechaDesde, fechaHasta } = req.query;
        if (!fechaDesde || !fechaHasta) {
            return res.status(400).send({ error: true, message: 'fechaDesde y fechaHasta son requeridas' });
        }

        const { id: idUsuario, codEmp, rol } = req.user;
        const pool = await getConnection();

        // Traer funcionarios según rol
        const funcionarios = rol === 'admin'
            ? await funcionarioModel.getByEmpresa(codEmp)
            : await supervisorFuncionarioModel.getByUsuario(idUsuario);

        // Traer todos los registros del período
        const request = pool.request()
            .input('fechaDesde', fechaDesde)
            .input('fechaHasta', fechaHasta)
            .input('codEmp', codEmp);

        // Si es supervisor, agregar filtro por sus funcionarios
        let joinSupervisor = '';
        if (rol !== 'admin') {
            request.input('idUsuario', idUsuario);
            joinSupervisor = `
                INNER JOIN SupervisorFuncionario sf 
                    ON sf.CodigoFuncionario = p.Codigo 
                    AND sf.IdUsuario = @idUsuario
            `;
        }

        const registros = await request.query(`
            SELECT 
                p.Codigo,
                CONVERT(VARCHAR, p.Fecha, 23) AS Fecha,
                p.IdUsuario,
                SUM(ISNULL(p.Hs, 0)) AS TotalHs
            FROM PlanillaHs p
            INNER JOIN Funcionarios f ON p.Codigo = f.Codigo
            ${joinSupervisor}
            WHERE f.CodEmp = @codEmp
                AND p.Fecha >= @fechaDesde
                AND p.Fecha <= @fechaHasta
            GROUP BY p.Codigo, p.Fecha, p.IdUsuario
        `);

        res.send({ error: false, data: { funcionarios, registros: registros.recordset } });
    } catch (err) {
        console.log('Error getGrilla:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getGrilla };