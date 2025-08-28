import aj from './config/arcjet.js';
const arcjetMiddleware = async (req,res,next) => {
    try{
        const decision = await aj.protect(req,{requested:1});// this requested paramenters makes sure every client taqkes only one token from the bucket
        if(decision.isDenied()){
            if(decision.reason.isRateLimit())
            {
                return res.status(429).json({error:'Rate limit exceeded'});
            }
            if(decision.reason.isBot())
            {
                return res.status(483).json({error:'Bot Detected'});
            }
            return res.status(483).json({error:'Access Denied'});
        }
        next();
    }catch(error)
    {
        console.log(`arcjet middleware:`+error);
        next(error);
    }
}
export default arcjetMiddleware;