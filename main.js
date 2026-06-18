const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const config = require('./config/routes');
const security = require('./middlewares/api-security-controller');

const __PORT__ = process.env.APP_PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(security.authorizationBearer({
    allowUrls: [
        {
            url: /login/,
            method: 'post'
        }
    ]
}));

app.use(function (err, req, res, next) {
    if (err) {
        const method = req.method;
        const url = req.url;
        console.log(method + " " + url + " StatusCode 400");
        res.status(400).send({ message: 'Error 400' });
    } else {
        next();
    }
});

app.use('/', config);

const server = app.listen(__PORT__, function () {
    console.log('Servidor en http://%s:%s', server.address().address, server.address().port);
});