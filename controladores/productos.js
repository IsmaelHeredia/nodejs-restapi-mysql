var express = require("express");
var bd = require("../funciones/conexion");
var helper = require("../funciones/helper.js");
var router = express.Router();

router.get("/", function (req, res) {

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM productos", function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando productos"});
    } else {
        res.json({estado:200, "productos":resultado});
    }
  });

  conexion.end();

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  var conexion = bd.retornarConexion();
  conexion.connect();

  conexion.query("SELECT * FROM productos WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando producto"});
    } else {
        res.json({estado:200, "producto":resultado});
    }
  });

  conexion.end();

});

router.post("/", async (req,res) => {

  try 
  {
    if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.descripcion)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta la descripción"});
    }
    else if(helper.estaVacio(req.body.precio))
    {
      res.status(400).json({estado:400, mensaje:"Falta el precio"});
    }
    else if(helper.estaVacio(req.body.id_proveedor))
    {
      res.status(400).json({estado:400, mensaje:"Falta el proveedor"});
    } 
    else 
    {
      var nombre = req.body.nombre;
      var descripcion = req.body.descripcion;
      var precio = req.body.precio;
      var id_proveedor = req.body.id_proveedor;
      var fecha_registro = helper.cargarFechaActual();
      
      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarProductoCrear(conexion, nombre);

      if(estaRepetido == false) {
        conexion.query("INSERT INTO productos(nombre,descripcion,precio,id_proveedor,fecha_registro) VALUES(?,?,?,?,?)",
                        [nombre,descripcion,precio,id_proveedor,fecha_registro],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error agregando producto"});
          } else {
              res.json({estado:200, mensaje:"Producto creado"});
          }
        });
      } else {
        res.status(400).json({estado:400, mensaje:"El producto con el nombre " + nombre + " ya existe"});
      }

      conexion.end();
    }

  } 
  catch (error) 
  {
    res.status(400).json({mensaje:error.message});
  }

});

const verificarProductoCrear = (conexion, nombre) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM productos WHERE nombre = ?",
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

  try 
  {
    if(helper.estaVacio(req.params.id)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.descripcion))
    {
      res.status(400).json({estado:400, mensaje:"Falta la descripción"});
    }
    else if(helper.estaVacio(req.body.precio))
    {
      res.status(400).json({estado:400, mensaje:"Falta el precio"});
    }
    else if(helper.estaVacio(req.body.id_proveedor)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta el proveedor"});
    } 
    else 
    {
      var id = req.params.id;
      var nombre = req.body.nombre;
      var descripcion = req.body.descripcion;
      var precio = req.body.precio;
      var id_proveedor = req.body.id_proveedor;

      var conexion = bd.retornarConexion();
      conexion.connect();

      const estaRepetido = await verificarProductoEditar(conexion, nombre, id);

      if(estaRepetido == false) {

        conexion.query("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, id_proveedor = ? WHERE id = ?",
                        [nombre,descripcion,precio,id_proveedor,id],
        function(error, resultado){
          if (error){
              res.status(400).json({estado:400, mensaje:"Error editando producto"});
          } else {
              res.json({estado:200, mensaje:"Producto editado"});
          }
        });

      } else {
        res.status(400).json({estado:400, mensaje:"El producto " + nombre + " ya existe"});
      }

      conexion.end();
    }

  }
  catch (error) 
  {
    res.status(400).json({estado:400, mensaje:error.message});
  }
  
});

const verificarProductoEditar = (conexion, nombre, id_producto) => {
  return new Promise((resolve) => {
    conexion.query(
      "SELECT * FROM productos WHERE nombre = ? AND id != ?",
      [nombre, id_producto],
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

  conexion.query("DELETE FROM productos WHERE id = ?", [id], function(error, resultado){
    if (error){
        res.status(400).json({estado:400, mensaje:"Error borrando producto"});
    } else {
        res.json({estado: 200, mensaje: "Producto borrado"});
    }
  });

  conexion.end();

});

module.exports = router;