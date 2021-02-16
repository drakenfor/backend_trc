const express = require('express');

//Variables de entorno
require('dotenv').config();

//Inicialización del server
const app = express();

//CORS
app.use(express.json());

//Rutas
app.use(require('./routes/index.routes'));


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Servidor online en: ' + process.env.HOST + ':' + process.env.PORT);
});