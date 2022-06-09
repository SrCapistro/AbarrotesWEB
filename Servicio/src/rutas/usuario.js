const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

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
    mysqlConnection.query('SELECT * FROM usuario ', (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Metodo de recuperación de correo electrónico 
router.post('/recovery', (req, res)=>{
    const correo = req.body.correo
    const codigorecuperacion = Math.floor(Math.random() * (99999 - 10000)) + 10000;
    try{
        mysqlConnection.query("update usuario set codigorecuperacion = ? where correo = ?",[codigorecuperacion, correo], (err, rows)=>{
            if (parseInt(rows.affectedRows) > 0) {
                res.send("1");
                generarCorreo(correo, codigorecuperacion);
            } else {
                res.send("0");
            }
        });
    }catch(err){
        res.send("Error al genererar el código");
    }
});

//Verificar el código
router.post('/passwordrecovery', (req, res)=>{
    const correo = req.body.correo;
    const codigoingresado = req.body.codigo;
    mysqlConnection.query("select codigorecuperacion from usuario where usuario.correo = ?", [correo, codigoingresado], (err, rows)=>{
        if(rows[0].codigorecuperacion == codigoingresado){
            res.send("1");
        }else{
            res.send("0");
        }
    })
})

//Cambiar contraseña
router.put('/cambiarpass', (req,res)=>{
    const contraseña = req.body.contraseña;
    const correo = req.body.correo;
    mysqlConnection.query("update usuario set contraseña = ?, codigorecuperacion = null where usuario.correo = ?", [contraseña, correo], (err, rows)=>{
        if(parseInt(rows.affectedRows) > 0) {
            res.send("1");
        } else {
            res.send("0");
        }
    })
})

async function generarCorreo(mail, codigo){
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user: "horchataroots@gmail.com",
                pass: "yvdskrdfcjjcndty"
            },
        });
    
        transporter.verify().then(()=>{
            console.log("Confirmado");
        })
        console.log(mail);
        let info = await transporter.sendMail({
            from: '"Abarrotes" <horchataroots@gmail.com>',
            to: mail,
            subject: "Código de recuperación",
            text: "Tu código de recuperación es: "+codigo,
        });
        console.log("Mensaje enviado: "+info.messageId);
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;