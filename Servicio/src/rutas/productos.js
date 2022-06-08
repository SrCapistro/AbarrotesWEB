const express = require('express');
const router = express.Router();

const mysqlConnection = require('../bd');


//OBTENER TODOS LOS PRODUCTOS
router.get('/productos', (req, res)=>{
    mysqlConnection.query('select * from producto p where p.estatus = 1', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            res.send(err);
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

//REGISTRAR NUEVO PRODUCTO
router.post('/productos/registrar', (req, res)=>{

    let {nombre, precio, cantidad, idCategoria, estatus} = req.body;

    mysqlConnection.query('INSERT INTO producto (`nombre`,`precio`,`cantidad`,`idCategoria`, `estatus`) VALUES (?, ?, ?, ?, ?);',[nombre, precio, cantidad, idCategoria, estatus], (err, rows, fields) =>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    });

});

//OBTENER TODOS LOS PRODUCTOS CON CATEGORIA
router.get('/productosCategorias', (req, res)=>{
    mysqlConnection.query('SELECT * FROM producto P LEFT JOIN categoria C ON P.idCategoria = C.idCatego', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//ELIMINAR UN PRODUCTO POR ID
router.delete('/productos/eliminar/:idProducto', (req, res) =>{
    const {idProducto} = req.params;
    mysqlConnection.query('DELETE FROM producto WHERE idProducto = ?;', [idProducto], (err, rows, fields)=>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    });
});

//ACTUALIZAR PRODUCTO
router.put('/productos/actualizar', (req, res)=>{

    let {idProducto, nombre, precio, cantidad, idCategoria, estatus} = req.body;
    
    mysqlConnection.query('UPDATE producto SET nombre = ?, precio = ?, cantidad = ?, idCategoria = ?, estatus = ? WHERE idProducto = ?;',[nombre, precio, cantidad, idCategoria, estatus, idProducto], (err, rows, fields) =>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    });

});


//Agregar producto al carrito
router.post('/agregarCarrito', async (req, res)=>{
    const {idUsuario, idProducto, cantidad, total} = req.body
    const producto = {
        idUsuario, 
        idProducto, 
        cantidad, 
        total
    };
    await mysqlConnection.query("INSERT INTO carrito set ?", [producto], (err, rows)=>{
        if(!err){
            res.json(rows.affectedRows)
        }else{
            console.log(err)
        }
    })
})

//Eliminar producto del carrito
router.delete('/eliminarCarrito/:idUsuario/:idProducto', (req, res)=>{
    const{idUsuario, idProducto} = req.params
    
    mysqlConnection.query('DELETE FROM carrito WHERE idUsuario = ? AND idProducto = ?', [idUsuario, idProducto], (err, rows)=>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    })
})
module.exports = router;