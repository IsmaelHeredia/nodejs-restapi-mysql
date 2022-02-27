var express = require("express");
var bd = require("../funciones/conexion");
var helper = require("../funciones/helper.js");
var router = express.Router();

router.get("/", function (req, res) {

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM usuarios", function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando usuarios"});
    } else {
        res.json({estado:200, "usuarios":resultado});
    }
  });

  conexion.end();

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM usuarios WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando usuario"});
    } else {
        res.json({estado:200, "usuario":resultado});
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
    else if(helper.estaVacio(req.body.clave))
    {
      res.status(400).json({estado:400, mensaje:"Falta la clave"});
    }
    else if(helper.estaVacio(req.body.id_tipo))
    {
      res.status(400).json({estado:400, mensaje:"Falta el tipo"});
    } 
    else 
    {
      var nombre = req.body.nombre;
      var clave = helper.codificarClave(req.body.clave);
      var id_tipo = req.body.id_tipo;
      var fecha_registro = helper.cargarFechaActual();

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarUsuarioCrear(conexion, nombre);

      if(estaRepetido == false) {

        conexion.query("INSERT INTO usuarios(nombre,clave,id_tipo,fecha_registro) VALUES(?,?,?,?)",
                        [nombre,clave,id_tipo,fecha_registro],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error agregando usuario"});
          } else {
              res.json({estado:200, mensaje:"Usuario creado"});
          }
        });

      } else {
        res.status(400).json({estado:400, mensaje:"El usuario " + nombre + " ya existe"});
      }

      conexion.end();
    }

  } catch (error) 
  {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

const verificarUsuarioCrear = (conexion, nombre) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM usuarios WHERE nombre = ?",
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
    else if(helper.estaVacio(req.body.id_tipo))
    {
      res.status(400).json({estado:400, mensaje:"Falta el tipo"});
    } 
    else 
    {
      var id = req.params.id;
      var id_tipo = req.body.id_tipo;

      var conexion = bd.retornarConexion();
      conexion.connect();

      conexion.query("UPDATE usuarios SET id_tipo = ? WHERE id = ?",
                      [id_tipo,id],
      function(error, resultado){
        if (error){
            res.status(400).json({estado:400, mensaje:"Error editando usuario"});
        } else {
            res.json({estado:200, mensaje:"Usuario editado"});
        }
      });

      conexion.end();
    }

  } catch (error) {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

router.delete("/:id", function (req, res) {
  var id = req.params.id;

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("DELETE FROM usuarios WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error borrando usuario"});
    } else {
        res.json({estado: 200, mensaje: "Usuario borrado"});
    }
  });

  conexion.end();

});

module.exports = router;