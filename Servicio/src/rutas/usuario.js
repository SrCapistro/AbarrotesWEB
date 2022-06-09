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
            res.json(rows.affectedRows)
        }else{
            console.log(err)
        }
    })
})

//OBTENER DATOS DE USUARIO SESION
router.get('/iniciarSesion/:correo/:contrasenia', (req, res) =>{
    const {correo, contrasenia} = req.params;
    mysqlConnection.query('SELECT * FROM usuario WHERE correo = ? AND contraseña = ?', [correo, contrasenia], (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//OBTENER DATOS DE USUARIO SESION
router.get('/obtenerUsuarios', (req, res) =>{
    const {correo, contrasenia} = req.params;
    mysqlConnection.query('SELECT * FROM usuario', [correo, contrasenia], (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

module.exports = router;