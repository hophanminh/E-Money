const { table } = require("console");
const mysql = require("mysql");
const util = require("util");
const config = require("../config/default.json");

const pool = mysql.createPool(config.mysql);

pool.getConnection(function (err, connection) {
  console.log("Connected to database.");
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  loadSafe: (sql_string, entity) => mysql_query(sql_string, entity),
  add: (tableName, entity) => mysql_query(`INSERT INTO ${tableName} SET ?`, entity),
  patch: (tableName, entity, condition) => mysql_query(`UPDATE ${tableName} SET ? WHERE ?`, [entity, condition]),
  delete: (tableName, condition) => mysql_query(`DELETE FROM ${tableName} WHERE ?`, [condition]),
}