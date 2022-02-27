module.exports = {

    cargarFechaActual() { 

        var fecha_actual = Date.now();

        var fecha_obj = new Date(fecha_actual);

        var dia = fecha_obj.getDate();
        var mes = fecha_obj.getMonth() + 1;
        var año = fecha_obj.getFullYear();
        
        var fecha = año + "-" + mes + "-" + dia;

        return fecha;
    },
    estaVacio(valor){
        return (valor == null || valor.length === 0);
    },
    codificarClave(clave) {
        var bcrypt = require("bcryptjs");
        var salto = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(clave, salto);        
        return hash;
    }

};