require("dotenv").config();

var mysql = require("mysql");

exports.retornarConexion = function(callback) {
	var connection = mysql.createConnection({
	  host     : process.env.SERVIDOR_MYSQL,
	  user     : process.env.USUARIO_MYSQL,
	  password : process.env.CLAVE_MYSQL,
	  database : process.env.BD_MYSQL
	});
	return connection;
};