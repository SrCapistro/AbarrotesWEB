const express = require('express');
const router = express.Router();

const mysqlConnection = require('../bd');


//OBTENER TODOS LOS PRODUCTOS
router.get('/productos', (req, res)=>{
    mysqlConnection.query('select * from producto p where p.estatus = 1', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//OBTENER UN PRODUCTO POR ID
router.get('/productos/:idProducto', (req, res) =>{
    const {idProducto} = req.params;
    mysqlConnection.query('SELECT * FROM producto p where p.idProducto = ?', [idProducto], (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//OBTENER POR CATEGORIA
router.get('/productos/categoria/:idCategoria', (req, res) =>{
    const {idCategoria} = req.params;
    mysqlConnection.query('SELECT p.idProducto, p.nombre, p.precio, p.cantidad, p.idCategoria,'+
    'c.nombreCatego from producto p join categoria c on c.idCatego = p.idCategoria and c.idCatego = ?', [idCategoria], (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});





module.exports = router;