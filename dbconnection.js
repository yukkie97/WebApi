var mysql = require('promise-mysql');
var DBCONFIG = require('./env.json')['DBCONFIG'];

module.exports = mysql.createConnection(DBCONFIG);