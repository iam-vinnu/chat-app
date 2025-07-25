import mongoose from "mongoose";

const connectDB = async () => {

    const uri = process.env.MONGO_URI ;
    if(!uri) throw new Error("MONGO_URI is not derived in the environment variable");

    try {
    await mongoose.connect(uri,{
        dbName : "chartappmicroservices"
    });
     console.log("Connected to MongoDB");
     
    } catch (error) {
        console.error("Failed to connect with MongoDB" , error);
        process.exit(1);   
    }
} 


export default connectDB;