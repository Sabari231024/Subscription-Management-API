const errorMiddleware = (err,req,res,next) => {// any middleware function lo0oks like this
// this is like subscriptions.pre where subsc -> midlleware(check for renewal date) -> other middlewares -> only when both  middle ware calls next we can navigate to the -> controller(it handles actual logic of the business)
try{
let error = {... err};
error.message = err.message;
console.error(err);
// we will try to decode teh error here
//Mongoose bad ObjectId
if(err.name === 'CastError'){
    const message = 'Resource not found';
    error = new Error(message);
    error.statusCode = 404;
}
//Mongoose duplicate key
if(err.code === 11000){
    const message = 'Duplicate field value entered'; // to get better error messages make them work in stacks
    error = new Error(message);
    error.statusCode = 400;
}    
//Mongoose validation error
if(err.name==='ValidationError'){
    const message = Object.values(err.errors).map(val=>val.message);
    error = new Error(message.join(', '));
    error.statusCode = 400;
}
res.status(error.statusCode || 500).json({success:false,error:error.message||'Server Error'});
}catch(error)
{
    next(error); // send this error to next block
}
}

export default errorMiddleware;

//middleware should modify the input request 