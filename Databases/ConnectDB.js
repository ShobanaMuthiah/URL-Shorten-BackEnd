import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const mongodb_url=process.env.MONGODB_URL;

 const connectDB= async(req,res)=>{
    try {
        
        const connection= await mongoose.connect(mongodb_url);
        console.log('mongodb connected sucessfully');
        return connection;
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:"mongodb connection error"})

    }
}

export default connectDB;