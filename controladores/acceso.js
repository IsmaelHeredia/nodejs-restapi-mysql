var express = require("express");
var bd = require("../funciones/conexion");
var helper = require("../funciones/helper.js");
var router = express.Router();

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

require("dotenv").config();

router.post("/", function (req, res) {

  if(helper.estaVacio(req.body.nombre))
  {
    res.status(400).json({estado:400, mensaje:"Falta el nombre"});
  }
  else if(helper.estaVacio(req.body.clave)) 
  {
    res.status(400).json({estado:400, mensaje:"Falta la clave"});
  }
  else 
  {
    var nombre = req.body.nombre;
    var clave = req.body.clave;

    var conexion = bd.retornarConexion();
    conexion.connect();

    conexion.query("SELECT id, nombre, clave, id_tipo FROM usuarios WHERE nombre = ? LIMIT 0,1", [nombre], function(error, resultado){
      if (error){
          res.status(400).json({estado:400, mensaje:"Error verificando los datos"});
      } else {
          if(resultado != "") {
            var id = resultado[0]["id"];
            var clave_bd = resultado[0]["clave"];
            var id_tipo = resultado[0]["id_tipo"];
            if(bcrypt.compareSync(clave, clave_bd)) {
              const payload = {
                id:  id,
                usuario: nombre,
                id_tipo : id_tipo
              };
              const token = jwt.sign(payload, process.env.CLAVE_JWT, {
                expiresIn: "365d"
              });
              res.json({estado:200,"token":token});
            } else {
              res.json({estado:200, mensaje:"Datos incorrectos"});
            }
          } else {
            res.json({estado:200, mensaje:"Datos incorrectos"});
          }
      }
    });

    conexion.end();

  }

});

router.post("/validar", function (req, res) {
  var token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.CLAVE_JWT, (err, decoded) => {      
      if (err) {
        return res.status(400).json({estado: 400, mensaje: "Token inválida" });    
      } else {
        res.json({estado:200,"token":decoded});
      }
    });
  } else {
    res.status(400).json({estado:400, mensaje: "Necesita enviar token"});
  }
});

module.exports = router;