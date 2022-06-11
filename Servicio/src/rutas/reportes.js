const express = require('express');
const router = express.Router();
const multer = require('multer');
const mimeTypes = require('mime-types');

const mysqlConnection = require('../bd');

// REGISTRA EL REPORTE CON IMAGEN
const storage = multer.diskStorage({
    destination: './img-reportes',

    filename: function(req, file, cb){
        console.log(file);
        console.log(req.body);

        var {comentarios, tipo, idUsuario, imagen} = req.body;

        var fileName = Date.now()+ "." + mimeTypes.extension(file.mimetype)
      
        cb("", fileName);
        
        mysqlConnection.query('INSERT INTO reporte (`comentarios`,`tipo`, `idUsuario`) VALUES (?, ?, ?);',[comentarios, tipo, idUsuario], (err, rows, fields) =>{
            if(!err){
                
                if(rows.insertId){
                    mysqlConnection.query('INSERT INTO `archivoReporte` (`ruta`, `idReporte`) VALUES (?, ?);',[ fileName ,rows.insertId], (err, rows, fields) =>{
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

  //REGISTRAR REPORTE
  router.post('/registrar', (req, res)=>{
    upload(req, res, function (error) {
        if (error) {
            res.json(error);
        }else{
            res.json(1);
        }
    });
});

module.exports = router;