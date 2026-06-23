const { getConnection } = require('../helpers/db');

const getByFechaObra = async (fecha, numObra) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('fecha', fecha)
        .input('numObra', numObra)
        .query(`
            SELECT p.*, 
                RTRIM(f.Apellido1) AS Apellido1,
                RTRIM(ISNULL(f.Apellido2, '')) AS Apellido2,
                RTRIM(f.Nombre1) AS Nombre1,
                RTRIM(ISNULL(f.Nombre2, '')) AS Nombre2
            FROM PlanillaHs p
            INNER JOIN Funcionarios f ON p.Codigo = f.Codigo
            WHERE p.Fecha = @fecha AND p.NumOra = @numObra
        `);
    return result.recordset;
};

const getParametroDia = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query('SELECT TOP 1 * FROM ParametroCargaHoraria');
    return result.recordset[0] || null;
};

const upsert = async ({ codigo, fecha, numObra, hs, hsExtra, hsExtraEsp, hsNoc, hsExNoc, hsExtNoctPerm, hsFeriados, hsLluvia, hsViaje, altura, donacion, asamblea, paternidad, fallecimiento }) => {
    const pool = await getConnection();

    const mes = fecha.substring(0, 7) + '-01';

    const existing = await pool.request()
        .input('codigo', codigo)
        .input('fecha', fecha)
        .input('numObra', numObra)
        .query('SELECT ID_ FROM PlanillaHs WHERE Codigo = @codigo AND Fecha = @fecha AND NumOra = @numObra');

    if (existing.recordset.length > 0) {
        await pool.request()
            .input('codigo', codigo)
            .input('fecha', fecha)
            .input('numObra', numObra)
            .input('hs', hs || 0)
            .input('hsExtra', hsExtra || 0)
            .input('hsExtraEsp', hsExtraEsp || 0)
            .input('hsNoc', hsNoc || 0)
            .input('hsExNoc', hsExNoc || 0)
            .input('hsExtNoctPerm', hsExtNoctPerm || 0)
            .input('hsFeriados', hsFeriados || 0)
            .input('hsLluvia', hsLluvia || 0)
            .input('hsViaje', hsViaje || 0)
            .input('altura', altura || 0)
            .input('donacion', donacion || 0)
            .input('asamblea', asamblea || 0)
            .input('paternidad', paternidad || 0)
            .input('fallecimiento', fallecimiento || 0)
            .query(`
                UPDATE PlanillaHs SET
                    Hs = @hs, HsExtra = @hsExtra, HsExtraEsp = @hsExtraEsp,
                    HsNoc = @hsNoc, HsExNoc = @hsExNoc, HsExtNoctPerm = @hsExtNoctPerm,
                    HsFeriados = @hsFeriados, HsLluvia = @hsLluvia, HsViaje = @hsViaje,
                    Altura = @altura, Donacion = @donacion, Asamblea = @asamblea,
                    Paternidad = @paternidad, Fallecimiento = @fallecimiento
                WHERE Codigo = @codigo AND Fecha = @fecha AND NumOra = @numObra
            `);
    } else {
        const maxId = await pool.request()
            .query('SELECT ISNULL(MAX(ID_), 0) + 1 AS NextId FROM PlanillaHs');
        const nextId = maxId.recordset[0].NextId;

        await pool.request()
            .input('id', nextId)
            .input('codigo', codigo)
            .input('mes', mes)
            .input('fecha', fecha)
            .input('numObra', numObra)
            .input('hs', hs || 0)
            .input('hsExtra', hsExtra || 0)
            .input('hsExtraEsp', hsExtraEsp || 0)
            .input('hsNoc', hsNoc || 0)
            .input('hsExNoc', hsExNoc || 0)
            .input('hsExtNoctPerm', hsExtNoctPerm || 0)
            .input('hsFeriados', hsFeriados || 0)
            .input('hsLluvia', hsLluvia || 0)
            .input('hsViaje', hsViaje || 0)
            .input('altura', altura || 0)
            .input('donacion', donacion || 0)
            .input('asamblea', asamblea || 0)
            .input('paternidad', paternidad || 0)
            .input('fallecimiento', fallecimiento || 0)
            .query(`
                INSERT INTO PlanillaHs (ID_, Codigo, Mes, Fecha, NumOra, Hs, HsExtra, HsExtraEsp, HsNoc, HsExNoc, HsExtNoctPerm, HsFeriados, HsLluvia, HsViaje, Altura, Donacion, Asamblea, Paternidad, Fallecimiento)
                VALUES (@id, @codigo, @mes, @fecha, @numObra, @hs, @hsExtra, @hsExtraEsp, @hsNoc, @hsExNoc, @hsExtNoctPerm, @hsFeriados, @hsLluvia, @hsViaje, @altura, @donacion, @asamblea, @paternidad, @fallecimiento)
            `);
    }
};

module.exports = { getByFechaObra, getParametroDia, upsert };