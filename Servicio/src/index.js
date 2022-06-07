const express = require('express');
const app = express();

app.set('port', process.env.port || 4000);

app.use(express.json());

app.use(require('./rutas/productos'))

app.use('/usuario', require('./rutas/usuario'))


app.listen(app.get('port'), () =>{
    console.log('Servidor en puerto ', app.get('port'))
})