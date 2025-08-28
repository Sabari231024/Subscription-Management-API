import mongoose from 'mongoose';
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
// this is merged with the auth route . basically the complex logic inside the auth route is brought out here as controllers
export const signUp = async (req,res,next) => {
    //implement the Signup Logic
    const session = await mongoose.startSession();//not user session instead session of mongoose transaction
    session.startTransaction(); // ensure the database operations are atomic (Either fully done or not done)
//if something went wrong on the process of manipulating data to database this will stop and revert the changes back
try{
 // Logic to create a new User
 console.log("in signup");
 const {name,email,password} = req.body;
 //check if the user already exist 
 const existingUser = await User.findOne({email});
 if(existingUser)
 {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
 }
 //Hash password to secure it 
 const salt = await bcrypt.genSalt(10);//random string attached to prevent attacks
 const hashPassword = await bcrypt.hash(password,salt);
 const newUsers = await User.create([{name,email,password:hashPassword}],{session}); //prevent something from going wrong attach session to it - create an shortcut for insert() or insertone in mongo
const token = jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
// newuser is array hence given [0]  || you give payload,secret and expire time
await session.commitTransaction();
session.endSession();
res.status(201).json(
    {
        success:true,
        message:'User created successfully',
        data:{
            token,
            user:newUsers[0]
        }
    }
)
}catch(error)
{
    await session.abortTransaction();
    session.endSession();
    next(error);
}
};

export const signIn = async (req,res,next) => {
try{
const {email,password} =req.body;
const user = await User.findOne({email});
if(!user)
{
    const error = new Error('User Not Found');
    error.statuscode = 404;
    throw error;
}
const isPasswordValid = await bcrypt.compare(password,user.password);
if(!isPasswordValid)
{
    const error = new Error('Invalid Password');
    error.statusCode = 401;
    throw error;
}
const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
res.status(200).json(
    {
        success:true,
        message:'User signed in successfully',
        data:{
            token,
            user
        }
    }
)
}catch(error){
    next(error);
}
};

export const signOut = async (req,res,next) => {
    try{
        res.status(200).json({
            success: true,
            message: 'User signed out successfully'
        });
    }catch(error){
        next(error);
    }
};

