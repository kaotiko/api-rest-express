let fLogin=(req,res,next)=>{
    console.log('Logging...')
    next();
} 

let setDate=(req,res,next)=>{
    req.requestTime = Date.now();
    next();
} 

module.exports = {
    fLogin,setDate
}