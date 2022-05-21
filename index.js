const express = require('express');
const app = express();

const Joi = require('joi');// validacion de emvios
const fs = require('fs');//abrir archivps
const morgan = require('morgan')// registro de status, tiempo de respuesto, tipo de respuesta
//Loads the handlebars module
const handlebars = require('express-handlebars');
// config para el entorno de desarrollo

const config=require('config');// entorno de desarrollo
console.log(config.get('nombre'))

const usuarios=require('./routes/usuarios')
const countries=require('./routes/country')

//const Logger =require('./logger');

/****************************************/
/*              middelware              */
/****************************************/

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(morgan('tiny'))//datos de periciones http
/*rutas de los apis */
app.use('/api/usuarios',usuarios)
app.use('/api/countries',countries)
//funciones externas
//app.use( Logger.setDate)
//app.use( Logger.fLogin)
/*########################################################################*/ 
//configuracion HAndlebars
var hbs = handlebars.create({
    defaultLayout:'main',
    layoutsDir:__dirname+'/views/layouts',
    extname: 'hbs',
    partialsDir: __dirname + '/views/partials/'
})
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars',hbs.engine);

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
/*########################################################################*/

// Definnir el la carpeta public 
app.use(express.static('public'))


app.use( (req,res,next)=>{
    console.log('Autentificacion...')
    next();
} )



/********************************************** */
/* rutas */
/********************************************** */

app.get('/', (req,res) => {
    let fecha =req.requestTime;
    res.send('Hola mundo perros!!! '+fecha);
} );



/*configuracion de el puerto */
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Escuchando por el puerto ${port} `);
})

