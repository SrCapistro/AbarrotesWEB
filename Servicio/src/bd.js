const mysql = require('mysql');


const mysqlConnection = mysql.createConnection({
    host: 'bm1o9olgx7cba8w2mcre-mysql.services.clever-cloud.com',
    user: 'uwlswcuptkbrwjcl',
    password: 'U33HzYPLzz0ZWEUogu98',
    database: 'bm1o9olgx7cba8w2mcre'
});

mysqlConnection.connect(function (err){
    if(err){
        console.log(err)
    }else{
        console.log('Conexión exitosa');
    }
});

module.exports = mysqlConnection;


