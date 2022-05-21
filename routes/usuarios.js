const express = require('express');

const rutas = express.Router();

/*variables */

const usuarios =[
    {id:1,nombre:'Luis'},
    {id:2,nombre:'Karen'},
    {id:3,nombre:'Donovan'},
    {id:4,nombre:'Maggaly'}
];



//rutas
rutas.get('/', (req,res) => {
    res.send(usuarios);
} );

rutas.get('/:id', (req,res) => {

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

rutas.post('/',(req,res)=>{
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

rutas.put('/',(req,res)=>{
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

rutas.delete('/',(req,res)=>{
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


module.exports=rutas;