const express = require('express');
const router = express.Router();

const mysqlConnection = require('../bd');

//REGISTRAR REPORTE INCIDENTE
router.post('/registrar', (req, res)=>{

    let {comentarios, tipo} = req.body;

    mysqlConnection.query('INSERT INTO reporte (`comentarios`,`tipo`) VALUES (?, ?);',[comentarios, tipo], (err, rows, fields) =>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    });

});

module.exports = router;