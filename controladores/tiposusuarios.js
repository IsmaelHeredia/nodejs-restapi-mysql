var express = require("express");
var bd = require("../funciones/conexion");
var helper = require("../funciones/helper.js");
var router = express.Router();

router.get("/", function (req, res) {

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM tipos_usuarios", function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando tipos de usuarios"});
    } else {
        res.json({estado:200, tipos_usuarios:resultado});
    }
  });

  conexion.end();

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM tipos_usuarios WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando tipo de usuario"});
    } else {
        res.json({estado:200, tipo_usuario:resultado});
    }
  });

  conexion.end();

});

router.post("/", async (req,res) => {

  try {

    if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    } 
    else 
    {
      var nombre = req.body.nombre;

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarTipoUsuarioCrear(conexion, nombre);

      if(estaRepetido == false) {

        conexion.query("INSERT INTO tipos_usuarios(nombre) VALUES(?)",
                        [nombre],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error agregando tipo de usuario"});
          } else {
              res.json({estado:200, mensaje:"Tipo de usuario creado"});
          }
        });

      } else {
        res.status(400).json({estado:400, mensaje:"El tipo de usuario " + nombre + " ya existe"});
      }

      conexion.end();
    }

  } catch (error) 
  {
     res.status(400).json({estado:400, mensaje:error.message});
  }

});

const verificarTipoUsuarioCrear = (conexion, nombre) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM tipos_usuarios WHERE nombre = ?",
      [nombre],
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

router.put("/:id", async (req,res) => {

  try {

    if(helper.estaVacio(req.params.id))
    {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    } 
    else 
    {
      var id = req.params.id;
      var nombre = req.body.nombre;

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarTipoUsuarioEditar(conexion, nombre, id);

      if(estaRepetido == false) {

        conexion.query("UPDATE tipos_usuarios SET nombre = ? WHERE id = ?",
                        [nombre,id],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error editando tipo de usuario"});
          } else {
              res.json({estado:200, mensaje:"Tipo de usuario editado"});
          }
        });

      } else {
        res.status(400).json({estado:400, mensaje:"El tipo de usuario " + nombre + " ya existe"});
      }

      conexion.end();
    }

  } catch (error) 
  {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

const verificarTipoUsuarioEditar = (conexion, nombre, id_tipousuario) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM tipos_usuarios WHERE nombre = ? AND id != ?",
      [nombre, id_tipousuario],
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

router.delete("/:id", function (req, res) {
  var id = req.params.id;

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("DELETE FROM tipos_usuarios WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error borrando tipo de usuario"});
    } else {
        res.json({estado: 200, mensaje: "Tipo de usuario borrado"});
    }
  });

  conexion.end();

});

module.exports = router;