const express = require('express');


const app = express();


const cors = require('cors');

//se importan las librerias y las credenciales 
const mysql = require('mysql');
const aws_keys = require('./creds_template');

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
//app.use(bodyParser.json({ limit: '10mb', extended: true }));
//app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))



var port = 3000;
app.listen(port);
console.log("Escuchando en el puerto", port)

// se manda a llamar las credenciales de Mysql 
const db_credentials = require('./db_creds.template.js');
var conn = mysql.createPool(db_credentials);

//Se inicializa el sdk para menejar los servicios de AWS 
var AWS = require('aws-sdk');

//instanciamos los servicios a utilizar con sus respectivos accesos.
//const s3 = new AWS.S3(aws_keys.s3);

app.get('/',(req,res) => res.send('Hola mundo con express'));


/******************************RDS *************/
//obtener datos de la BD
app.get("/get-user", async (req, res) => {
    conn.query(`SELECT * FROM user`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

//insertar datos
app.post("/insertdata", async (req, res) => {
    let body = req.body;
    conn.query('INSERT INTO ejemplo VALUES(?,?)', [body.id, body.nombre], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});