const express = require('express');
const router = express.Router();

const mysqlConnection = require('../bd');

//Registrar usuario cliente
router.post("/registrarUsuario", async (req, res)=>{
    const {nombreCompleto, estatus, tipo, contraseña, correo, telefono} = req.body
    const nuevoUsuario = {
        nombreCompleto, 
        estatus, 
        tipo, 
        contraseña, 
        correo, 
        telefono
    };
    await mysqlConnection.query("INSERT INTO usuario set ?", [nuevoUsuario], (err, rows)=>{
        if(!err){
            res.send("Registro exitoso")
        }else{
            console.log(err)
        }
    })
})

module.exports = router;