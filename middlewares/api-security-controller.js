let _allowUrls = [];

const _allowUrl = function (url, method) {
    for (let i = 0; i < _allowUrls.length; i++) {
        if (url.match(_allowUrls[i].url) && method.toUpperCase() == _allowUrls[i].method.toUpperCase()) return true;
    }
    return false;
}

const authorizationBearer = function (config) {
    _allowUrls = config.allowUrls || [];
    return _authorizationBearer;
}

const _authorizationBearer = function (req, res, next) {
    const method = req.method;
    const url = req.url;
    const authorization = req.headers['authorization'];

    if (url == '/authenticate' && method.toUpperCase() == 'POST')
        if (authorization) res.status(500).send({ error: true, message: 'Authentication header is not allowed' }); else next();
    else if (_allowUrl(url, method)) {
        next();
    } else {
        if (authorization) {
            const parseAuth = authorization.split(' ');

            if (parseAuth.length != 2) {
                res.status(400).send({ error: true, message: 'Bad Request' });
            } else {
                if (parseAuth[0] != 'Bearer') {
                    res.status(500).send({ error: true, message: 'Type of authorization not allowed' });
                } else {
                    const access_token = parseAuth[1];
                    const parseToken = access_token.split("_");

                    if (parseToken.length > 0 && parseToken.length < 2) {
                        res.status(500).send({ error: true, message: 'The access_token has an invalid format' });
                    } else {
                        const username = parseToken[0];
                        let token = '';

                        for (let i = 1; i < parseToken.length; i++) {
                            token += parseToken[i] + "_";
                        }
                        // Saco ultimo guion
                        token = token.substring(0, token.length - 1);

                        // Obtengo la PrivateKey del usuario
                        const pkey = require('../helpers/private_key');
                        pkey.value(username).then(function (private_key) {
                            const AuthToken = require('../plugins/auth-token');
                            const jwt = require('jsonwebtoken');
                            const auth = new AuthToken(jwt);

                            /* Verifico token */
                            auth.getValidToken(token, private_key).then(function (verif) {
                                if (verif.err) {
                                    res.status(500).send({ error: true, message: 'The access_token is incorrect' });
                                } else {
                                    const data = verif.decoded;

                                    if (!data.username) {
                                        res.status(500).send({ error: true, message: 'The access_token did not come with the user' });
                                    } else {
                                        if (data.username == username) {
                                            next();
                                        } else {
                                            res.status(500).send({ error: true, message: 'Invalid user' });
                                        }
                                    }
                                }
                            });
                        }).catch(function (err) {
                            console.log("authorizationBearer ERROR");
                            res.status(500).send({ error: true, message: err.message });
                        });
                    }
                }
            }
        } else {
            const validateAuth = process.env.VALIDATE_AUTH || 'yes';
            if (validateAuth == 'yes' || validateAuth == 'YES') {
                res.status(401).send({ error: true, message: 'Not authorized' });
            } else {
                next();
            }
        }
    }
}

module.exports = {
    authorizationBearer
}