var express = require("express");
var bd = require("../funciones/conexion");
var helper = require("../funciones/helper.js");
var router = express.Router();

router.get("/", function (req, res) {

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM proveedores", function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando proveedores"});
    } else {
        res.json({estado:200, "proveedores":resultado});
    }
  });

  conexion.end();

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM proveedores WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando proveedor"});
    } else {
        res.json({estado:200, "proveedor":resultado});
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
    else if(helper.estaVacio(req.body.direccion))
    {
      res.status(400).json({estado:400, mensaje:"Falta la dirección"});
    }
    else if(helper.estaVacio(req.body.telefono))
    {
      res.status(400).json({estado:400, mensaje:"Falta el teléfono"});
    }
    else 
    {
      var nombre = req.body.nombre;
      var direccion = req.body.direccion;
      var telefono = req.body.telefono;
      var fecha_registro = helper.cargarFechaActual();

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarProveedorCrear(conexion, nombre);

      if(estaRepetido == false) {
        conexion.query("INSERT INTO proveedores(nombre,direccion,telefono,fecha_registro) VALUES(?,?,?,?)",
                        [nombre,direccion,telefono,fecha_registro],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error agregando proveedor"});
          } else {
              res.json({estado:200, mensaje:"Proveedor creado"});
          }
        });
      } else {
        res.status(400).json({estado:400, mensaje:"El proveedor " + nombre + " ya existe"});
      }

      conexion.end();
    }

  } catch (error)
  {
     res.status(400).json({estado:400, mensaje:error.message});
  }

});

const verificarProveedorCrear = (conexion, nombre) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM proveedores WHERE nombre = ?",
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

    if(helper.estaVacio(req.params.id)) {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.direccion))
    {
      res.status(400).json({estado:400, mensaje:"Falta la dirección"});
    }
    else if(helper.estaVacio(req.body.telefono))
    {
      res.status(400).json({estado:400, mensaje:"Falta el teléfono"});
    }
    else 
    {
      var id = req.params.id;
      var nombre = req.body.nombre;
      var direccion = req.body.direccion;
      var telefono = req.body.telefono;

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarProveedorEditar(conexion, nombre, id);

      if(estaRepetido == false) {

        conexion.query("UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?",
                        [nombre,direccion,telefono,id],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error editando producto"});
          } else {
              res.json({estado:200, mensaje:"Producto editado"});
          }
        });
    

      } else {
        res.status(400).json({estado:400, mensaje:"El proveedor " + nombre + " ya existe"});
      }

      conexion.end();
    }

  } catch (error) 
  {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

const verificarProveedorEditar = (conexion, nombre, id_proveedor) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM proveedores WHERE nombre = ? AND id != ?",
      [nombre, id_proveedor],
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

  conexion.query("DELETE FROM proveedores WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error borrando proveedor"});
    } else {
        res.json({estado: 200, mensaje: "Proveedor borrado"});
    }
  });

  conexion.end();

});

module.exports = router;