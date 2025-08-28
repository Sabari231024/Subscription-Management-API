import express from 'express';
import {PORT} from './config/env.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './DataBase/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js'; // custom middleware
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';
//built in middlewares


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));// helps us process the data with urls
app.use(cookieParser()); // reads cookies from incoming request
app.use(arcjetMiddleware);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);
app.use(errorMiddleware);

app.get('/',(req,res)=>{
    res.send("hii");
})

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

export default app;