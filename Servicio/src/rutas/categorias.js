const express = require('express');
const router = express.Router();

const mysqlConnection = require('../bd');


//OBTENER TODAS LAS CATEGORIAS
router.get('/obtenerCategorias', (req, res)=>{
    mysqlConnection.query('select * from categoria', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});



module.exports = router;