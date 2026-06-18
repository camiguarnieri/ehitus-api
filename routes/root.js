const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send({ message: 'Ehitus API OK' });
});

module.exports = router;