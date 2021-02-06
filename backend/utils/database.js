const mysql = require("mysql");
const util = require("util");
const config = require("../config/default.json");

const pool =mysql.createPool(config.PM_DATABASE);

pool.getConnection(function (err, connection){
    console.log("Connected to database.");
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
    load: sql => mysql_query(sql),
    add: (tableName, entity) => mysql_query(`INSERT INTO ${tableName} SET ?`, entity),
}