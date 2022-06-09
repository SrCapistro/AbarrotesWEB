/*
//Registrar reporte
router.post("/registrar", async (req, res)=>{
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
})*/

//REGISTRAR NUEVO PRODUCTO
router.post('/reportes/registrar', (req, res)=>{

    let {comentarios, tipo} = req.body;

    mysqlConnection.query('INSERT INTO reporte (`comentarios`,`tipo`) VALUES (?, ?);',[comentarios, tipo], (err, rows, fields) =>{
        if(!err){
            res.json(rows.affectedRows);
        }else{
            console.log(err);
        }
    });

});