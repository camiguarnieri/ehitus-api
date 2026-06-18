const dbConfig = require('../config/database');
const manager = require('./pool-manager');

const getConnection = async function () {
    try {
        return await manager.get('ehitus', dbConfig.configDB);
    } catch (err) {
        console.log("SQLException: " + err.message);
    }
}

const sql = manager.sql;

module.exports = {
    sql,
    getConnection
}