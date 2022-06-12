const express = require('express');
const multer = require('multer');
const mimeTypes = require('mime-types');
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
    mysqlConnection.query('SELECT * FROM producto p LEFT JOIN archivo a ON p.idProducto = a.idProducto LEFT JOIN categoria c ON p.idCategoria = c.idCatego where p.idProducto = ?', [idProducto], (err, rows, fields)=>{
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

//OBTENER POR CATEGORIA CON IMAGEN
router.get('/productos/categoriaImagen/:idCategoria', (req, res) =>{
    const {idCategoria} = req.params;
    
    mysqlConnection.query('SELECT P.idProducto, P.cantidad, P.idCategoria, P.nombre, P.precio, A.ruta FROM producto P LEFT JOIN categoria C ON P.idCategoria = C.idCatego LEFT JOIN archivo A ON P.idProducto = A.idProducto WHERE P.estatus = 1 AND P.idCategoria = ?', [idCategoria], (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

// REGISTRA LA IMAGEN EN EL SERVIDOR
const storage = multer.diskStorage({
    
    destination: './img-productos',

    filename: function(req, file, cb){

        var {nombre, precio, cantidad, idCategoria, estatus} = req.body;

        var fileName = Date.now()+ "." + mimeTypes.extension(file.mimetype)
      
        cb("", fileName);
        
        mysqlConnection.query('INSERT INTO producto (`nombre`,`precio`,`cantidad`,`idCategoria`, `estatus`) VALUES (?, ?, ?, ?, ?);',[nombre, precio, cantidad, idCategoria, estatus], (err, rows, fields) =>{
            if(!err){
                
                if(rows.insertId){
                    mysqlConnection.query('INSERT INTO `archivo` (`ruta`, `idProducto`) VALUES (?, ?);',[ fileName ,rows.insertId], (err, rows, fields) =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }else{
                console.log(err);
            }
        });
    }
  })

  const upload = multer({
    storage: storage
  }).single('imagen');
  
//REGISTRAR NUEVO PRODUCTO
router.post('/registrar', (req, res)=>{
    upload(req, res, function (error) {
        if (error) {
            res.json(error);
        }else{
            res.json(1);
        }
    });
});

// OBTENER TODOS LOS PRODUCTOS CON CATEGORIA
router.get('/productosCategorias', (req, res)=>{
    mysqlConnection.query('SELECT P.idProducto, P.nombre, P.precio, P.cantidad, P.idCategoria, P.estatus, C.nombreCatego, A.idArchivo, A.ruta FROM producto P LEFT JOIN categoria C ON P.idCategoria = C.idCatego LEFT JOIN archivo A ON P.idProducto = A.idProducto', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//ELIMINAR UN PRODUCTO POR ID
router.delete('/eliminar/:idProducto', (req, res) =>{
    const {idProducto} = req.params;
    mysqlConnection.query('DELETE FROM producto WHERE idProducto = ?;', [idProducto], (err, rows, fields)=>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            res.json(rows);
            console.log(err);
        }
    });
});

// REGISTRA LA IMAGEN EN EL SERVIDOR
const storageUpdate = multer.diskStorage({
    
    destination: './img-productos',

    filename: function(req, file, cb){

        let {idProducto, nombre, precio, cantidad, idCategoria, estatus} = req.body;

        var fileName = Date.now()+ "." + mimeTypes.extension(file.mimetype)
      
        cb("", fileName);

        

        mysqlConnection.query('UPDATE producto SET nombre = ?, precio = ?, cantidad = ?, idCategoria = ?, estatus = ? WHERE idProducto = ?;',[nombre, precio, cantidad, idCategoria, estatus, idProducto], (err, rows, fields) =>{
            if(err){
                console.log(err);
            }
        });

        mysqlConnection.query('SELECT COUNT(*) as cantidad FROM archivo  WHERE idProducto = ?',[idProducto], (err, rows, fields) =>{
            if(!err){

                if(rows[0].cantidad > 0){
                    mysqlConnection.query('UPDATE `archivo` SET `ruta` = ? WHERE `idProducto` = ?;',[ fileName ,idProducto], (err, rows, fields) =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }else{
                    mysqlConnection.query('INSERT INTO `archivo` (`ruta`, `idProducto`) VALUES (?, ?);',[ fileName ,idProducto], (err, rows, fields) =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }else{
                console.log(err);
            }
        });
    }
  })

const uploadUpdate = multer({
    storage: storageUpdate
});
  
//ACTUALIZAR PRODUCTO
router.put('/actualizar', uploadUpdate.single('imagen'), (req, res)=>{

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

//Eliminar producto del carrito
router.delete('/eliminarCarrito/:idCarrito', (req, res)=>{
    const{idCarrito} = req.params
    
    mysqlConnection.query('SELECT cantidad, idProducto FROM carrito WHERE idCarrito = ?', [idCarrito], (err, rows)=>{
        if(!err){

            var{cantidad, idProducto} = rows[0];

            mysqlConnection.query('SELECT cantidad FROM producto WHERE idProducto = ?',[idProducto], (err, rows)=>{
                if(!err){

                    let sumaProductos =  cantidad + rows[0].cantidad;
                    let estatus = sumaProductos > 0 ? 1:0;

                    mysqlConnection.query('UPDATE producto SET  cantidad = ?, estatus = ? WHERE idProducto = ?;',[sumaProductos, estatus, idProducto ], (err, rows, fields) =>{
                        if(!err){
                            mysqlConnection.query('DELETE FROM carrito WHERE idCarrito = ?', [idCarrito], (err, rows)=>{
                                if(!err){
                                    res.json(rows.affectedRows);
                                }else{
                                    console.log(err);
                                }
                            })
                        }else{
                            console.log(err);
                        }
                    });
                }else{
                    console.log(err);
                }
            })
        }else{
            console.log(err);
        }
    })
})

//OBTENER TODOS LOS PRODUCTOS DE UN CARRITO
router.get('/obtenerCarrito/:idUsuario', (req, res)=>{
    const{idUsuario} = req.params
    mysqlConnection.query('SELECT C.idCarrito, C.idUsuario, C.idProducto, C.cantidad as cantidad, C.total, P.nombre, P.precio, P.cantidad as Existencia  FROM carrito C LEFT JOIN producto P ON C.idProducto = P.idProducto WHERE C.idUsuario = ?',[idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Actualizar cantidad total de productos restante
router.put('/restarProductos', (req, res)=>{
    let {cantidad, idProducto} = req.body
    mysqlConnection.query("UPDATE producto set cantidad = (select (cantidad - ?)) where idProducto = ?", [cantidad, idProducto], (err, rows)=>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    })
})

//ACTUALIZAR PRODUCTO DE CARRITO Y PRODUCTO
router.put('/carrito/producto/actualizar', (req, res)=>{
    
    var {idCarrito, idProducto, sumarCarrito, cantidad, cantidadActual, total} = req.body;

    mysqlConnection.query('SELECT cantidad FROM producto WHERE idProducto = ?',[idProducto], (err, rows)=>{
        if(!err){

            if (sumarCarrito) {
                if(cantidad > rows[0].cantidad){
                    res.json(rows[0].cantidad);
                }else{
                    var cantidadTotalProducto = rows[0].cantidad - cantidad;
                    var statusProducto = cantidadTotalProducto == 0 ? 0:1;
                    mysqlConnection.query('UPDATE producto SET cantidad = ?, estatus = ? WHERE idProducto = ?;', [cantidadTotalProducto, statusProducto, idProducto], (err, rows)=>{
                        if(!err){
                            if(rows.affectedRows){
                                var cantidadTotalCarrito = cantidadActual + cantidad;
                                mysqlConnection.query('UPDATE carrito SET  cantidad = ?, total = ? WHERE idCarrito = ?;', [cantidadTotalCarrito, total, idCarrito], (err, rows)=>{
                                    if(!err){
                                        res.json(rows.affectedRows);
                                    }else{
                                        console.log(err);
                                        res.json(err);
                                    }
                                })
                            }
                        }else{
                            console.log(err);
                            res.json(err);
                        }
                    })
                }
            }else{
                var cantidadTotalProducto = rows[0].cantidad + cantidad;
                var statusProducto = cantidadTotalProducto == 0 ? 0:1;
                mysqlConnection.query('UPDATE producto SET cantidad = ?, estatus = ? WHERE idProducto = ?;', [cantidadTotalProducto, statusProducto, idProducto], (err, rows)=>{
                    if(!err){
                        if(rows.affectedRows){
                            var cantidadTotalCarrito = cantidadActual - cantidad;
                            mysqlConnection.query('UPDATE carrito SET  cantidad = ?, total = ? WHERE idCarrito = ?;', [cantidadTotalCarrito, total, idCarrito], (err, rows)=>{
                                if(!err){
                                    res.json(rows.affectedRows);
                                }else{
                                    console.log(err);
                                    res.json(err);
                                }
                            })
                        }
                    }else{
                        console.log(err);
                        res.json(err);
                    }
                })
            }
        }else{
            console.log(err);
            res.json(err);
        }
    })
});

module.exports = router;