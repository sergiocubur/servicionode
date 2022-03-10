const express = require('express');
var bodyParser = require('body-parser');
var md5 =require("md5");
const app = express();


const cors = require('cors');

//se importan las librerias y las credenciales 
const mysql = require('mysql');
const aws_keys = require('./creds_template');

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))



var port = 5000;
app.listen(port);
console.log("Escuchando en el puerto", port)

// se manda a llamar las credenciales de Mysql 
const db_credentials = require('./db_creds.template.js');
var conn = mysql.createPool(db_credentials);

//Se inicializa el sdk para menejar los servicios de AWS 
var AWS = require('aws-sdk');
//instanciamos los servicios a utilizar con sus respectivos accesos.
const s3 = new AWS.S3(aws_keys.s3);

app.get('/',(req,res) => res.send());


// VIEW
app.get("/view-user", async (req, res) => {
    conn.query(`SELECT * FROM user`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/view-album", async (req, res) => {
    conn.query(`SELECT * FROM album`, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/view-photo", async (req, res) => {
    let body = req.body;
    conn.query(`SELECT * FROM photo where albumid`, [body.albumid], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/login", async (req, res) => {
    let body = req.body;
    conn.query(`SELECT * FROM user where user=? AND password=?`, [body.user, md5(body.password)], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// ADD
app.post("/add-user", async (req, res) => {
    
    let body = req.body;
    conn.query('INSERT INTO user(user,password,name,path) VALUES(?,?,?,?)', [body.user, md5(body.password),body.name,body.path], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.post("/add-album", async (req, res) => {
    
    let body = req.body;
    conn.query('INSERT INTO album(name) VALUES(?)', [body.name], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.post("/add-photo", async (req, res) => {
    
    let body = req.body;
    conn.query('INSERT INTO photo(name,albumid,usuarioid,path) VALUES(?,?,?,?)', [body.name,body.albumid,body.usuarioid,body.path], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
// EDIT
app.put("/edit-user", async (req, res) => {
    
    let body = req.body;
    conn.query('UPDATE user SET user=?,password=?,name=?,path=? WHERE id=?', [body.user, md5(body.password),body.name,body.path,body.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.put("/edit-album", async (req, res) => {
    
    let body = req.body;
    conn.query('UPDATE album SET name=? WHERE id=?', [body.name,body.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// BYID
app.post("/byid-user", async (req, res) => {

    let body = req.body;
    conn.query(`SELECT * FROM user WHERE id=?`, [body.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.post("/byid-album", async (req, res) => {

    let body = req.body;
    conn.query(`SELECT * FROM album WHERE id=?`, [body.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// DELETE
app.delete("/delete-user", async (req, res) => {
    let body = req.body;
    conn.query(`DELETE FROM user WHERE id=?`, [body.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
app.delete("/delete-album", async (req, res) => {
    let body = req.body;
    conn.query(`DELETE FROM album WHERE id=?`, [body.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
//*********************************************ALMACENAMIENTO****************************************************
// ruta que se usa para subir una foto 

app.post('/subirfoto', function (req, res) {
    
    var id = req.body.id;
    var foto = req.body.foto;
    //carpeta y nombre que quieran darle a la imagen

    var nombrei = "fotos/" + id + ".jpg"; // fotos -> se llama la carpeta 
    //se convierte la base64 a bytes
    let buff = new Buffer.from(foto, 'base64');

    AWS.config.update({
        region: 'us-east-1', // se coloca la region del bucket 
        accessKeyId: 'AKIA3777HMDJA64H43BI',
        secretAccessKey: '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'
    });

    var s3 = new AWS.S3(); // se crea una variable que pueda tener acceso a las caracteristicas de S3
    // metodo 1
    const params = {
        Bucket: "semi1-fotos",
        Key: nombrei,
        Body: buff,
        ContentType: "image"
    };
    const putResult = s3.putObject(params).promise();
    res.json({ mensaje: putResult })

});

app.post('/obtenerfoto', function (req, res) {
    var id = req.body.id;
    var nombrei = "fotos/" + id + ".jpg";

    AWS.config.update({
        region: 'us-east-1', // se coloca la region del bucket 
        accessKeyId: 'AKIA3777HMDJA64H43BI',
        secretAccessKey: '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'
    });

    var S3 = new AWS.S3();

    var getParams =
    {
        Bucket: "semi1-fotos",
        Key: nombrei
    }

    S3.getObject(getParams, function (err, data) {
        if (err) {
            res.json(error)
        } else {
            var dataBase64 = Buffer.from(data.Body).toString('base64'); //resgresar de byte a base
            res.json({ mensaje: dataBase64 })
        }

    })

});