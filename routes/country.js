const express = require('express');
const fs = require('fs');//abrir archivps

const rutas = express.Router();

// DAtos paises
let rawdata = fs.readFileSync('countries.json');
const countries = JSON.parse(rawdata);
//console.log(student);


/*********************************************************/
/********** PAises API **************/
/*********************************************************/

rutas.get('/', (req,res) => {
    
    //res.send(countries);
    //res.render('main', {layout : 'index'});
     //res.send(countries);
    //res.render('main', {layout : 'index'});
    //console.log(typeof(countries['country']))
    res.render('main', {layout : 'country',list_country:countries['country']});
    //console.log(countries)
} );


rutas.get('/:descripcion', (req,res) => {
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


module.exports=rutas;