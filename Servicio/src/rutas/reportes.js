const express = require('express');
const router = express.Router();

const mysqlConnection = require('../bd');

//REGISTRAR REPORTE INCIDENTE
router.post('/registrar', (req, res)=>{

    let {comentarios, tipo, idUsuario} = req.body;

    mysqlConnection.query('INSERT INTO reporte (`comentarios`,`tipo`, `idUsuario`) VALUES (?, ?, ?);',[comentarios, tipo, idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    });

});

module.exports = router;