const express = require('express');
const app = express();

app.set('port', process.env.port || 4000);

app.use(express.json());
app.use('/productos', require('./rutas/productos'))
app.use('/usuario', require('./rutas/usuario'))
app.use('/categorias',require('./rutas/categorias'))


app.listen(app.get('port'), () =>{
    console.log('Servidor en puerto ', app.get('port'))
})