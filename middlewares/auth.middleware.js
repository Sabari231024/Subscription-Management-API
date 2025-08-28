import { JWT_SECRET } from "../config/env.js";
import jwt from 'jsonwebtoken';
import User from "../models/user.models.js";
const authorize = async (req,res,next) =>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ //if bearer protocol then token will be passed
            token = req.headers.authorization.split(' ')[1]; //usually Bearer <token> we take teh token alone
        }
        if(!token) return res.status.json({message:'Unauthorized'});
        const decoded = jwt.verify(token,JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user) return res.status.json({message:'Unauthorized'});

        req.user = user;
        next();

    }catch(error){
        res.status(401).json({message:'Unauthorized',error:error.message});
    }
}
export default authorize;