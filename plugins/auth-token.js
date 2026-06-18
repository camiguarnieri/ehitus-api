const jwt = require('jsonwebtoken');

class AuthToken {
    constructor(jwt) {
        this.jwt = jwt;
    }

    getValidToken(token, privateKey) {
        return new Promise((resolve) => {
            this.jwt.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    resolve({ err: true });
                } else {
                    resolve({ err: false, decoded });
                }
            });
        });
    }
}

module.exports = AuthToken;