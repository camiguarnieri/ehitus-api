const { getConnection } = require('../helpers/db');

const getAll = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT CodCat, RTRIM(ISNULL(Descripcion, '')) AS Descripcion
                FROM Categorias
                WHERE EnUso = 1
                ORDER BY CodCat
            `);
        res.send({ error: false, data: result.recordset });
    } catch (err) {
        console.log('Error getAll categorias:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { getAll };