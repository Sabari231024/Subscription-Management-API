import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Subscription name is required'],
            trim: true,
            minLength: 2,
            maxLenght: 100,
        },
        price:{
            type:Number,
            required:[true,'Subscription price is required'],
            min: [0,'Price must be Greater than 0'],
        },
        currency:{
            type:String,
            enum:['RUP','USD','BIT'],
            default:'RUP'
        },
        freequency:{
            type:String,
            enum:['daily','weekly','monthly','yearly'],
        },
        category:{
            type:String,
            enum:['sports','technology','news','finance','food','others'],
            required:true,
        },
        paymentMethod:{
            type:String,
            required:true,
            trim:true,
        },
        status:{
            type:String,
            enum:['active','cancelled','expired'],
            default:'active'
        },
        startDate:{
            type:Date,
            required:true,
            validate:{// pass an validator funciton
                validator: (value)=> value <= new Date(),
                message:'Start date must be in the past' // if not this message will be sent 
            }
        },
        //we are validatiung it before it is given to dbs
        renewalDate:{
            type:Date,
            required:true,
            validate: {
                validator: function (value) {
                return value > this.startDate
                }, // we are comparing it with the start date
                message:'renewal date must be after teh start date'
            }
        },
        user:{
            type: mongoose.Schema.Types.ObjectId, //we get id that is reference to the user models
            ref: 'User',// here the user is referenced
            required: true,
            index:true //this helps optimizing the queries by setting indexing field
        }
    },
    {
        timestamps:true
    }
);

// now we will create a function that happens before teh each document is created 
//Autocalculate teh renewable date if it is missing
subscriptionSchema.pre('save',function (next) {
    if(!this.renewalDate)
    {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.freequency])
    }
    //Autoupdate teh status
    if(this.renewalDate< new Date())
    {
        this.status = 'expired';
    }
    next();// next is an callback function provided by the mongoose that you have completed the proces call it
})

const Subscriptions = mongoose.model('Subscriptions',subscriptionSchema);
export default Subscriptions;