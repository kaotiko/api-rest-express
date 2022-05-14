const express = require('express');
const app = express();

const Joi = require('joi');// validacion de emvios
const fs = require('fs');//abrir archivps
const morgan = require('morgan')// registro de status, tiempo de respuesto, tipo de respuesta
//Loads the handlebars module
const handlebars = require('express-handlebars');
// config para el entorno de desarrollo

const config=require('config');

console.log(config.get('nombre'))

//const Logger =require('./logger');

/****************************************/
/*              middelware              */
/****************************************/

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

app.use(morgan('tiny'))

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

/*variables */

const usuarios =[
    {id:1,nombre:'Luis'},
    {id:2,nombre:'Karen'},
    {id:3,nombre:'Donovan'},
    {id:4,nombre:'Maggaly'}
]

let rawdata = fs.readFileSync('countries.json');
const countries = JSON.parse(rawdata);
//console.log(student);



/* rutas */
app.get('/', (req,res) => {
    let fecha =req.requestTime;
    res.send('Hola mundo perros!!! '+fecha);
} );

app.get('/api/usuarios', (req,res) => {
    res.send(usuarios);
} );

app.get('/api/usuarios/:id', (req,res) => {

    //let usuario=usuarios.find( u => u.id === parseInt(req.params.id));
    let usuario=existe_usuario(req.params.id);
    
    if(!usuario){
        res.status(404);
        res.send('Usuario no encontrado')
    }else{
        res.send(usuario); 
    }
    //res.send(req.params.id);  // m/234
    //res.send(req.query); // query string ?sexo=m&edad=234
} );
/*peticiones post */ 

app.post('/api/usuarios',(req,res)=>{
    // validar con join

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
/*  password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
        repeat_password: Joi.ref('password'),
    
        access_token: [
            Joi.string(),
            Joi.number()
        ],
    
        birth_year: Joi.number()
            .integer()
            .min(1900)
            .max(2013),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
*/

    })

    //validar
    const {error,value}=validar_datos(req.body);

    if(!error){
        const usuario= {
            id:usuarios.length+1,
            nombre:value.nombre
    
        }
    
        usuarios.push(usuario);
        res.send(usuario)
    }else{
        res.status(400)
        res.send(error['details'][0]['message'])
    }

})
// metodho PUT
/*
app.put('/api/usuarios/:id',(req,res)=>{
    let usuario=usuarios.find( u => u.id === parseInt(req.params.id));
    if(!usuario){
        res.status(404);
        res.send('Usuario no encontrado, seas mamon')
    }else{
        //recoger squema
        const schema = Joi.object({
            nombre: Joi.string().min(3).required()

        })
        //validar esquema
        const {error,value}=schema.validate({ nombre:req.body.nombre });

        //Si existe error en validacion
        if(error){
            res.status(400)
            res.send(error['details'][0]['message']);
            res.end()
            
        }else{
            usuario.nombre=value.nombre;
            res.send(usuario)
        }
    }
})
*/

app.put('/api/usuarios/',(req,res)=>{
    //let usuario=usuarios.find( u => u.id === parseInt(req.body.id));
    let usuario=existe_usuario(req.body.id);
    if(!usuario){
        res.status(404);
        res.send('Usuario no encontrado, seas mamon')
    }else{
        

        //VAlidar
        const {error,value}=validar_datos(req.body);
        
        if(error){
            res.status(400)
            res.send(error['details'][0]['message']);
            res.end()
            
        }else{
            usuario.nombre=value.nombre;
            res.send(usuario)
        }
    }
})


//metodo delete

app.delete('/api/usuarios/',(req,res)=>{
    let usuario=existe_usuario(req.body.id);
    if(!usuario){
        res.status(404);
        res.send('Usuario no encontrado, seas mamon')
    }else{
        const idDelete=usuarios.indexOf(usuario);
        usuarios.splice(idDelete,1);

        res.send('Adios vaquer@ '+JSON.stringify(usuario))
    }
})

/*********************************************************/
/********** PAises API **************/
/*********************************************************/
app.get('/countries/', (req,res) => {
    
    //res.send(countries);
    //res.render('main', {layout : 'index'});
    //console.log(typeof(countries['country']))
    res.render('main', {layout : 'country',list_country:countries['country']});
    //console.log(countries)
} );


app.get('/api/countries/', (req,res) => {
    
    //res.send(countries);
    res.render('main', {layout : 'index'});
} );


app.get('/api/countries/:descripcion', (req,res) => {
    let country_temp =  req.params.descripcion;
    let list_country=get_pais(country_temp)
    if(!list_country){
        //res.status(404);
        res.send('Sin resultados que mostrar')
    }else{
        res.send(list_country)
        console.log(list_country.length)
        //res.send('mostrar rsultados ')
    }
} );


/*configuracion de el puerto */

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Escuchando por el puerto ${port} `);
})


function existe_usuario(id){
    let usuario_temp=usuarios.find( u => u.id === parseInt(id));
    //console.log(usuarios)
    //console.log(id)
    return usuario_temp;
}

function validar_datos(parametros){
    //recoger squema
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()

    })
    //validar esquema
    return schema.validate({ nombre:parametros.nombre });
}


/*****************************/
function get_pais(descripcion){

    
    console.log(countries['country'].length)
    //let resultado=countries;
    var rObj = []
    ;
    countries['country'].map( (obj) => {
            if(obj.name.includes(descripcion.toUpperCase) ){
                let temp_obj={};
                temp_obj['name']= obj.name;
                temp_obj['capital']= obj.capital;
                temp_obj['continent']= obj.continent;
                temp_obj['time_zone_capital']= obj.time_zone_capital;
                temp_obj['currency']= obj.currency;
                temp_obj['language_codes']= obj.language_codes;
                rObj.push(temp_obj)
                //console.log(obj.name)

            }
              
    });

    //let resultado= countries['country'];  
    //console.log( JSON.stringify(countries['country']))
    //console.log( JSON.stringify(resultado))
    //countries.find( u => u.name === parseInt(descripcion));
    //console.log(countries)
    //resultado=countries.find( u => u.name === parseInt(descripcion)); 

    
    return rObj;

}
