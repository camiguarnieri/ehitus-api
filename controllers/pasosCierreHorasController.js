const model = require('../models/pasosCierreHorasModel');

const get = async (req, res) => {
    try {
        const data = await model.get();
        res.send({ error: false, data });
    } catch (err) {
        console.log('Error get pasos cierre horas:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

const save = async (req, res) => {
    try {
        const mes = req.body.mes || req.body.Mes;
        const body = {
            mes,
            enEhitus: req.body.enEhitus ?? req.body.EnEhitus ?? 0,
            cierreMes: req.body.cierreMes ?? req.body.CierreMes ?? 0,
            traspasoMesEhitus: req.body.traspasoMesEhitus ?? req.body.TraspasoMesEhitus ?? 0,
            actualizarObras: req.body.actualizarObras ?? req.body.ActualizarObras ?? 0,
        };
        const existing = await model.get();
        if (existing) {
            await model.update(body);
        } else {
            await model.create(body);
        }
        res.send({ error: false, message: 'Guardado correctamente' });
    } catch (err) {
        console.log('Error save pasos cierre horas:', err.message);
        res.status(500).send({ error: true, message: err.message });
    }
};

module.exports = { get, save };