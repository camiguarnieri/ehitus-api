const { getConnection } = require('../helpers/db');

const getReporte = async ({ mesDesde, mesHasta, numObra, codigo, codEmp, idUsuario, rol }) => {
    const pool = await getConnection();

    let where = `f.CodEmp = @codEmp`;
    const request = pool.request()
        .input('codEmp', codEmp)
        .input('idUsuario', idUsuario);

    if (mesDesde) { request.input('mesDesde', mesDesde); where += ` AND p.Fecha >= @mesDesde`; }
    if (mesHasta) { request.input('mesHasta', mesHasta); where += ` AND p.Fecha <= @mesHasta`; }
    if (numObra) { request.input('numObra', numObra); where += ` AND p.NumOra = @numObra`; }
    if (codigo) { request.input('codigo', codigo); where += ` AND p.Codigo = @codigo`; }

    const joinSupervisor = rol === 'admin' ? '' : `
        INNER JOIN SupervisorFuncionario sf 
            ON sf.CodigoFuncionario = p.Codigo 
            AND sf.IdUsuario = @idUsuario
    `;

    const result = await request.query(`
        SELECT 
            p.ID_,
            p.Codigo,
            RTRIM(f.Apellido1) + ' ' + RTRIM(f.Nombre1) AS NombreCompleto,
            CONVERT(VARCHAR, p.Fecha, 23) AS Fecha,
            RTRIM(o.Descripcion) AS Obra,
            p.NumOra,
            ISNULL(p.Hs, 0) AS Hs,
            ISNULL(p.HsExtra, 0) AS HsExtra,
            ISNULL(p.HsExtraEsp, 0) AS HsExtraEsp,
            ISNULL(p.HsNoc, 0) AS HsNoc,
            ISNULL(p.HsExNoc, 0) AS HsExNoc,
            ISNULL(p.HsExtNoctPerm, 0) AS HsExtNoctPerm,
            ISNULL(p.HsFeriados, 0) AS HsFeriados,
            ISNULL(p.HsLluvia, 0) AS HsLluvia,
            ISNULL(p.HsViaje, 0) AS HsViaje,
            ISNULL(p.Altura, 0) AS Altura,
            ISNULL(p.Donacion, 0) AS Donacion,
            ISNULL(p.Asamblea, 0) AS Asamblea,
            ISNULL(p.Paternidad, 0) AS Paternidad,
            ISNULL(p.Fallecimiento, 0) AS Fallecimiento
        FROM PlanillaHs p
        INNER JOIN Funcionarios f ON p.Codigo = f.Codigo
        INNER JOIN Obras o ON p.NumOra = o.NumObra
        ${joinSupervisor}
        WHERE ${where}
        ORDER BY p.Fecha DESC, f.Apellido1, f.Nombre1
    `);

    return result.recordset;
};

module.exports = { getReporte };