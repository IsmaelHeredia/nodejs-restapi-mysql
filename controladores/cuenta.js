var express = require("express");
var bd = require("../funciones/conexion");
var helper = require("../funciones/helper.js");
var router = express.Router();

router.post("/cambiarUsuario", async (req,res) => {

  try {

    if(helper.estaVacio(req.body.id))
    {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else 
    {
      var id = req.body.id;
      var nombre = req.body.nombre;

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarUsuarioEditar(conexion, nombre, id);

      if(estaRepetido == false) {

        conexion.query("UPDATE usuarios SET nombre = ? WHERE id = ?",
                        [nombre,id],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error cambiando nombre de usuario"});
          } else {
              res.json({estado:200, mensaje:"Nombre de usuario cambiado"});
          }
        });

      } else {
        res.status(400).json({estado:400, mensaje:"El usuario " + nombre + " ya existe"});
      }
      
      conexion.end();
    }

  } catch (error) {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

const verificarUsuarioEditar = (conexion, nombre, id_usuario) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM usuarios WHERE nombre = ? AND id != ?",
      [nombre, id_usuario],
      (error, resultado) => {
        
        if (error) {
          return reject(error);
        }

        if (resultado && resultado.length >= 1) {
          return resolve(true);
        }

        resolve(false);
      });
  });
};

router.post("/cambiarClave", async (req,res) => {

    try {
  
      if(helper.estaVacio(req.body.id))
      {
        res.status(400).json({estado:400, mensaje:"Falta el ID"});
      }
      else if(helper.estaVacio(req.body.clave))
      {
        res.status(400).json({estado:400, mensaje:"Falta la clave"});
      }
      else 
      {
        var id = req.body.id;
        var clave = helper.codificarClave(req.body.clave);
  
        var conexion = bd.retornarConexion();
        conexion.connect();
      
        conexion.query("UPDATE usuarios SET clave = ? WHERE id = ?",
                        [clave,id],
        function(error, resultado){
            if (error){
                res.status(400).json({estado:400, mensaje:"Error cambiando clave"});
            } else {
                res.json({estado:200, mensaje:"Clave cambiada"});
            }
        });
          
        conexion.end();
      }
  
    } catch (error) {
      res.status(400).json({estado:400, mensaje:error.message});
    }
  
  });

module.exports = router;