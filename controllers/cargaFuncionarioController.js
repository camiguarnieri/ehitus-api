const planillaModel = require('../models/planillaHsModel');
const supervisorFuncionarioModel = require('../models/supervisorFuncionarioModel');
const funcionarioModel = require('../models/funcionarioModel');

const getByFuncionarioPeriodo = async (req, res) => {
    try {
        const { codigo, mes, quincena } = req.query;
        if (!codigo || !mes || !quincena) {
            return res.status(400).send({ error: true, message: 'codigo, mes y quincena son requeridos' });
        }

        const { id: idUsuario, codEmp, rol } = req.user;

        // Calcular fechas del período
        const [year, month] = mes.split('-').map(Number);
        let fechaDesde, fechaHasta;

        if (quincena === '1') {
            fechaDesde = `${mes}-01`;
            fechaHasta = `${mes}-15`;
        } else {
            const ultimoDia = new Date(year, month, 0).getDate();
            fechaDesde = `${mes}-16`;
            fechaHasta = `${mes}-${ultimoDia.toString().padStart(2, '0')}`;
        }

        // Traer funcionario
        const funcionario = await funcionarioModel.getById(codigo);
        if (!funcionario) {
            return res.status(404).send({ error: true, message: 'Funcionario no encontrado' });
        }

        // Traer parámetro de horas
        const parametro = await planillaModel.getParametroDia();

        // Traer registros existentes del período para ese funcionario
        const pool = require('../helpers/db').getConnection ? await require('../helpers/db').getConnection() : null;
        const { getConnection } = require('../helpers/db');
        const conn = await getConnection();
        const registros = await conn.request()
            .input('codigo', codigo)
            .input('fechaDesde', fechaDesde)
            .input('fechaHasta', fechaHasta)
            .query(`
                SELECT 
                    CONVERT(VARCHAR, Fecha, 23) AS Fecha,
                    NumOra,
                    ISNULL(Hs, 0) AS Hs,
                    ISNULL(HsExtra, 0) AS HsExtra,
                    ISNULL(HsExtraEsp, 0) AS HsExtraEsp,
                    ISNULL(HsNoc, 0) AS HsNoc,
                    ISNULL(HsExNoc, 0) AS HsExNoc,
                    ISNULL(HsExtNoctPerm, 0) AS HsExtNoctPerm,
                    ISNULL(HsFeriados, 0) AS HsFeriados,
                    ISNULL(HsLluvia, 0) AS HsLluvia,
                    ISNULL(HsViaje, 0) AS HsViaje,
                    ISNULL(Altura, 0) AS Altura,
                    ISNULL(Donacion, 0) AS Donacion,
                    ISNULL(Asamblea, 0) AS Asamblea,
                    ISNULL(Paternidad, 0) AS Paternidad,
                    ISNULL(Fallecimiento, 0) AS Fallecimiento
                FROM PlanillaHs
                WHERE Codigo = @codigo
                    AND Fecha >= @fechaDesde
                    AND Fecha <= @fechaHasta
            `);

        res.send({
            error: false,
            data: {
                funcionario,
                parametro,
                fechaDesde,
                fechaHasta,
                registros: registros.recordset,
            }
        });
    } catch (err) {
        console.log('Error getByFuncionarioPeriodo:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getByFuncionarioPeriodo };